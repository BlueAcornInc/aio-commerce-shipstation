import ShipstationConfigForm from "./ShipstationConfigForm";

export const MainPage = props => {
    const namespace = process.env.AIO_runtime_namespace
    const actionUrl = `https://35582-shipstationlocal-local.adobeioruntime.net/api/v1/web/aio-commerce-shipstation-app/shipstation-config`
    return (
        <ShipstationConfigForm actionUrl={actionUrl} />
    )
}
