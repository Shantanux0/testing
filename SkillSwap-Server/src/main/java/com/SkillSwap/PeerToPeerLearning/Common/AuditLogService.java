package com.SkillSwap.PeerToPeerLearning.Common;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@Slf4j
public class AuditLogService {

    public void logAction(String userId, String action, String details) {
        // In a real system, this would write to a DB table or external audit system
        log.info("AUDIT | Timestamp: {} | User: {} | Action: {} | Details: {}",
                LocalDateTime.now(), userId, action, details);
    }

    public void logSecurityEvent(String ipAddress, String event) {
        log.warn("SECURITY | Timestamp: {} | IP: {} | Event: {}",
                LocalDateTime.now(), ipAddress, event);
    }
}
