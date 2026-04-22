package com.SkillSwap.PeerToPeerLearning.Common;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        // Enable a simple memory-based message broker to carry the messages back to the client on destinations prefixed with /topic
        config.enableSimpleBroker("/topic");
        // Designate the /app prefix for messages that are bound for methods annotated with @MessageMapping
        config.setApplicationDestinationPrefixes("/app");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // Register the /ws endpoint, enabling the SockJS fallback 
        registry.addEndpoint("/ws")
                .setAllowedOriginPatterns("*")
                .withSockJS();
                
        // Register a native, raw WebSocket endpoint for modern clients (Vite compatibility)
        registry.addEndpoint("/ws-native")
                .setAllowedOriginPatterns("*");
    }
}
