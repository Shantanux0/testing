package com.SkillSwap.PeerToPeerLearning.Common;

import com.SkillSwap.PeerToPeerLearning.P1Auth.Config.CustomAuthenticationEntryPoint;
import com.SkillSwap.PeerToPeerLearning.P1Auth.Filter.JwtRequestFilter;
import com.SkillSwap.PeerToPeerLearning.P1Auth.Service.impl.AppUserDetailService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.List;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {
    private final AppUserDetailService appUserDetailsService;
    private final JwtRequestFilter jwtRequestFilter;
    private final CustomAuthenticationEntryPoint customAuthenticationEntryPoint;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http.cors(Customizer.withDefaults())
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(auth -> auth
                        // Public Endpoints
                        .requestMatchers("/api/auth/login", "/api/auth/register",
                                "/api/auth/send-reset-otp", "/api/auth/reset-password",
                                "/api/auth/logout", "/api/auth/send-otp", "/api/auth/verify-otp",
                                "/api/auth/is-authenticated")
                        .permitAll()
                        
                        // WebSocket signaling
                        .requestMatchers("/ws-native/**", "/ws/**").permitAll()

                        // Profile Module
                        .requestMatchers("/api/profile/**").authenticated()

                        // Resume Module
                        .requestMatchers("/api/resume/**").authenticated()

                        // Test Portal Module (NEW)
                        .requestMatchers("/api/test/**").authenticated()

                        // Any other endpoints
                        .anyRequest().authenticated())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .logout(AbstractHttpConfigurer::disable)
                .addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter.class)
                .exceptionHandling(ex -> ex.authenticationEntryPoint(customAuthenticationEntryPoint));

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public CorsFilter corsFilter() {
        return new CorsFilter(corsConfigurationSource());
    }

    private CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOriginPatterns(List.of(
                "http://localhost:[*]",
                "http://127.0.0.1:[*]",
                "http://192.168.*:[*]",
                "http://10.*:[*]",
                "http://172.16.*:[*]",
                "http://172.17.*:[*]",
                "http://172.18.*:[*]",
                "http://172.19.*:[*]",
                "http://172.20.*:[*]",
                "http://172.21.*:[*]",
                "http://172.22.*:[*]",
                "http://172.23.*:[*]",
                "http://172.24.*:[*]",
                "http://172.25.*:[*]",
                "http://172.26.*:[*]",
                "http://172.27.*:[*]",
                "http://172.28.*:[*]",
                "http://172.29.*:[*]",
                "http://172.30.*:[*]",
                "http://172.31.*:[*]"
        ));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
        config.setAllowedHeaders(List.of("Authorization", "Content-Type"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    @Bean
    public AuthenticationManager authenticationManager() {
        DaoAuthenticationProvider authenticationProvider = new DaoAuthenticationProvider();
        authenticationProvider.setUserDetailsService(appUserDetailsService);
        authenticationProvider.setPasswordEncoder(passwordEncoder());
        return new ProviderManager(authenticationProvider);
    }
}