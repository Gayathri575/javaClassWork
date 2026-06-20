package com.example.JavaNotes.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/keycloak")
public class KeycloakAuthController {

    @GetMapping("/me")
    public ResponseEntity<Map<String, Object>> keycloakMe(
            @AuthenticationPrincipal Jwt jwt) {

        Map<String, Object> info = new HashMap<>();
        info.put("subject", jwt.getSubject());
        info.put("username", jwt.getClaimAsString("preferred_username"));
        info.put("email", jwt.getClaimAsString("email"));
        info.put("roles", jwt.getClaimAsMap("realm_access"));
        info.put("issuer", jwt.getIssuer());
        info.put("expires", jwt.getExpiresAt());

        return ResponseEntity.ok(info);
    }
}

