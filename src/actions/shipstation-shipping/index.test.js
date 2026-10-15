const crypto = require("crypto");

const mockLogger = {
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
};
jest.mock("@adobe/aio-sdk", () => ({
  Core: {
    Logger: jest.fn(() => mockLogger),
  },
}));
jest.mock("@adobe/aio-commerce-lib-config", () => ({
  initialize: jest.fn(),
  getConfigurationByKey: jest.fn(),
  byStoreViewId: jest.fn((id) => ({ storeViewId: id })),
  byCodeAndLevel: jest.fn((code, level) => ({ code, level })),
}));

const libConfig = require("@adobe/aio-commerce-lib-config");
const { main } = require("./index");

const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
  modulusLength: 2048,
  publicKeyEncoding: { type: "spki", format: "pem" },
  privateKeyEncoding: { type: "pkcs8", format: "pem" },
});

const RATE_REQUEST = {
  store_id: "1",
  dest_country_id: "US",
  dest_postcode: "28401",
  dest_region_code: "NC",
  dest_city: "Wilmington",
  dest_street: "1 Market St",
  items: [{ weight: 2 }, { weight: 0 }],
};

const CONFIG = {
  status: "on",
  shipstationApiKey: "decrypted-test-key",
  shipstationCarrierIds: "se-1, se-2",
  warehouseName: "Warehouse",
  warehousePhone: "555-0100",
  warehouseAddressLine1: "2 Dock Rd",
  warehouseCityLocality: "Charlotte",
  warehouseStateProvince: "NC",
  warehousePostalCode: "28202",
  warehouseCountryCode: "US",
};

/**
 * Builds signed webhook params for a rate request.
 *
 * @param {object} rateRequest The rate request
 * @param {object} extra Extra params
 * @returns {object} Action params
 */
function signedParams(rateRequest = RATE_REQUEST, extra = {}) {
  const raw = JSON.stringify({ rateRequest });
  const body = Buffer.from(raw).toString("base64");
  const signer = crypto.createSign("SHA256");
  signer.update(body);
  return {
    __ow_body: body,
    __ow_headers: {
      "x-adobe-commerce-webhook-signature": signer.sign(privateKey, "base64"),
    },
    COMMERCE_WEBHOOKS_PUBLIC_KEY: publicKey,
    AIO_COMMERCE_CONFIG_ENCRYPTION_KEY: "config-key",
    ...extra,
  };
}

/**
 * Make getConfigurationByKey resolve from a plain object of field values.
 *
 * @param {object} values Field values by name
 */
function storedConfig(values) {
  libConfig.getConfigurationByKey.mockImplementation(async (name) => ({
    config: { name, value: values[name] },
  }));
}

describe("ShipStation shipping rates webhook", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    libConfig.getConfigurationByKey.mockReset();
    global.fetch = jest.fn();
  });

  test("rejects a request whose signature doesn't verify", async () => {
    const params = signedParams();
    params.__ow_headers["x-adobe-commerce-webhook-signature"] = "bad";

    const response = await main(params);

    expect(response.body.op).toBe("exception");
    expect(global.fetch).not.toHaveBeenCalled();
    expect(libConfig.getConfigurationByKey).not.toHaveBeenCalled();
  });

  test("fails closed without a public key", async () => {
    const response = await main(
      signedParams(RATE_REQUEST, { COMMERCE_WEBHOOKS_PUBLIC_KEY: undefined }),
    );

    expect(response.body.op).toBe("exception");
    expect(global.fetch).not.toHaveBeenCalled();
  });

  test("offers no methods when ShipStation is off", async () => {
    storedConfig({ ...CONFIG, status: "off" });

    const response = await main(signedParams());

    expect(JSON.parse(response.body)).toEqual([]);
    expect(global.fetch).not.toHaveBeenCalled();
  });

  test("reads the store view's config with the encryption key", async () => {
    storedConfig({ ...CONFIG, status: "off" });

    await main(signedParams());

    expect(libConfig.byStoreViewId).toHaveBeenCalledWith(1);
    expect(libConfig.getConfigurationByKey).toHaveBeenCalledWith(
      "shipstationApiKey",
      { storeViewId: 1 },
      { encryptionKey: "config-key" },
    );
  });

  test("falls back to global when the store view isn't in the scope tree", async () => {
    libConfig.getConfigurationByKey.mockImplementation(async (name, scope) => {
      if (scope.storeViewId) throw new Error("INVALID_SCOPE: Unknown scope");
      return { config: { name, value: { status: "off" }[name] } };
    });

    const response = await main(signedParams());

    expect(JSON.parse(response.body)).toEqual([]);
    expect(libConfig.byCodeAndLevel).toHaveBeenCalledWith("global", "global");
  });

  test("returns ShipStation rates as shipping methods", async () => {
    storedConfig(CONFIG);
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        rate_response: {
          rates: [
            {
              service_code: "usps_ground",
              service_type: "USPS Ground",
              carrier_friendly_name: "USPS",
              shipping_amount: { amount: 7.5 },
            },
            {
              service_code: "usps_ground",
              service_type: "USPS Ground",
              shipping_amount: { amount: 9 },
            },
          ],
        },
      }),
    });

    const response = await main(signedParams());
    const operations = JSON.parse(response.body);

    expect(operations).toHaveLength(2);
    expect(operations[0].value).toMatchObject({
      carrier_code: "ShipStation",
      method: "usps_ground",
      price: 7.5,
    });
    expect(operations[1].value.method).toBe("usps_ground_2");

    const [url, init] = global.fetch.mock.calls[0];
    expect(url).toBe("https://api.shipstation.com/v2/rates");
    expect(init.headers["API-Key"]).toBe("decrypted-test-key");
    const sent = JSON.parse(init.body);
    expect(sent.rate_options.carrier_ids).toEqual(["se-1", "se-2"]);
    expect(sent.shipment.packages).toEqual([
      { weight: { value: 2, unit: "pound" } },
      { weight: { value: 1, unit: "pound" } },
    ]);
  });

  test("reports incomplete configuration without calling ShipStation", async () => {
    storedConfig({ ...CONFIG, shipstationApiKey: undefined });

    const response = await main(signedParams());

    expect(response.body.op).toBe("exception");
    expect(global.fetch).not.toHaveBeenCalled();
  });

  test("never logs the API key, encryption key or ShipStation error bodies", async () => {
    storedConfig(CONFIG);
    global.fetch.mockResolvedValue({
      ok: false,
      status: 401,
      text: async () => "echo of decrypted-test-key",
    });

    const response = await main(signedParams());

    expect(response.body.op).toBe("exception");
    const logged = JSON.stringify(
      Object.values(mockLogger).flatMap((fn) => fn.mock.calls),
    );
    ["decrypted-test-key", "config-key"].forEach((value) => {
      expect(logged).not.toContain(value);
      expect(JSON.stringify(response.body)).not.toContain(value);
    });
  });
});
