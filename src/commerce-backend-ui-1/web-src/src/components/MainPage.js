import ShipstationConfigForm from "./ShipstationConfigForm";

export const MainPage = props => {
    const namespace =
        (typeof process !== "undefined" && process.env.__OW_NAMESPACE) ||
        "35582-shipstationlocal-local";
    const appName = "35582-shipstationlocal-local";
    const ACTION_URL = `/api/v1/web/${appName}/shipstation-config`;
    console.log("ACTION_URL:", ACTION_URL);

    return (
        <ShipstationConfigForm actionUrl={ACTION_URL} />
    )
}
