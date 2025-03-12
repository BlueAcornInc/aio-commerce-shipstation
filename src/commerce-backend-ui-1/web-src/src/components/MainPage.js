import ShipstationConfigForm from "./ShipstationConfigForm";

export const MainPage = props => {
    //This needs to be refactored and not hard coded for multi-tenant purposes
    const namespace =
        (typeof process !== "undefined" && process.env.__OW_NAMESPACE) ||
        "35582-shipstation-stage";
    const appName = "aio-commerce-shipstation-app";
    const ACTION_URL = `https://35582-shipstation-stage.adobeio-static.net/api/v1/web/${appName}/shipstation-config`;
    console.log("ACTION_URL:", ACTION_URL);

    return (
        <ShipstationConfigForm actionUrl={ACTION_URL} />
    )
}
