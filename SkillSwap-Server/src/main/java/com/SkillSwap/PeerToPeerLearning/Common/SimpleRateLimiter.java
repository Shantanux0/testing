package com.SkillSwap.PeerToPeerLearning.Common;

import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;

/**
 * A simple in-memory rate limiter for demonstration.
 * Limit: 100 requests per minute per IP.
 */
@Component
public class SimpleRateLimiter implements Filter {

    private final Map<String, TokenBucket> buckets = new ConcurrentHashMap<>();

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        HttpServletRequest httpRequest = (HttpServletRequest) request;
        String clientIp = httpRequest.getRemoteAddr();

        TokenBucket bucket = buckets.computeIfAbsent(clientIp, k -> new TokenBucket());

        if (bucket.tryConsume()) {
            chain.doFilter(request, response);
        } else {
            ((HttpServletResponse) response).setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
            response.getWriter().write("Too many requests. Please try again later.");
        }
    }

    private static class TokenBucket {
        private final long capacity = 100;
        private final long refillRateMs = 60000; // 1 minute
        private AtomicInteger tokens = new AtomicInteger(100);
        private AtomicLong lastRefill = new AtomicLong(System.currentTimeMillis());

        public boolean tryConsume() {
            refill();
            if (tokens.get() > 0) {
                tokens.decrementAndGet();
                return true;
            }
            return false;
        }

        private void refill() {
            long now = System.currentTimeMillis();
            long last = lastRefill.get();
            if (now - last > refillRateMs) {
                tokens.set((int) capacity);
                lastRefill.set(now);
            }
        }
    }
}
