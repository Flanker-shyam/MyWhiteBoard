import React, { useState, useEffect } from 'react';
import Keycloak, { KeycloakInstance } from 'keycloak-js';
import keycloakConfig from '../keycloakConfig'; // Assuming keycloakConfig.ts contains your Keycloak configuration

const Test: React.FC = () => {
  const [keycloak, setKeycloak] = useState<KeycloakInstance | null>(null);
  const [authenticated, setAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const initKeycloak = async () => {
      try {
        const keycloakInstance = new Keycloak('../keycloakConfig');
        await keycloakInstance.init({ onLoad: 'login-required' });
        setKeycloak(keycloakInstance);
        setAuthenticated(keycloakInstance.authenticated!);
      } catch (error) {
        console.error('Keycloak initialization error:', error);
      }
    };
    initKeycloak();
  }, []);

  const login = () => {
    keycloak?.login();
  };

  const logout = () => {
    keycloak?.logout();
  };

  return (
    <div>
      {authenticated ? (
        <>
          <p>Welcome, {keycloak?.tokenParsed?.preferred_username}</p>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <button onClick={login}>Login</button>
      )}
    </div>
  );
};

export default Test;
