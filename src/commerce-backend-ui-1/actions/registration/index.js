// src/commerce-backend-ui-1/actions/registration/index.js
async function main() {
    const extensionId = 'ShipStation'

    return {
        statusCode: 200,
        body: {
            registration: {
                menuItems: [
                    {
                        id: `${extensionId}::first`,
                        title: 'ShipStation',
                        parent: `${extensionId}::apps`,
                        sortOrder: 1
                    },
                    {
                        id: `${extensionId}::apps`,
                        title: 'ShipStation',
                        isSection: false,
                        sortOrder: 100
                    }
                ],
                page: {
                    title: 'ShipStation'
                }
            }
        }
    }
}

exports.main = main
