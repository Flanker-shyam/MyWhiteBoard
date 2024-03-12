import Keycloak from "keycloak-js";

const keycloakConfig = new Keycloak({
    realm:'whiteBoard',
    url:'http://localhost:8080/auth/',
    clientId:'white-board'
})

export default keycloakConfig;