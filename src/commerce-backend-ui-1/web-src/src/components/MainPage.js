import ShipstationConfigForm from "./ShipstationConfigForm";

export const MainPage = props => {
    const namespace = process.env.AIO_runtime_namespace
    const actionUrl = `https://${namespace}.adobeio-static.net/api/v1/web/ShipStation/commerce-rest-get`

    return (
        <ShipstationConfigForm actionUrl={actionUrl} />
    )
}
