package com.SkillSwap.PeerToPeerLearning.P7Session.Service;

import org.springframework.stereotype.Service;
import java.util.Collections;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.Map;

@Service
public class SessionPresenceService {

    // sessionId -> Set of user emails currently in the room
    private final Map<Long, Set<String>> sessionUsers = new ConcurrentHashMap<>();

    public void addUser(Long sessionId, String email) {
        sessionUsers.computeIfAbsent(sessionId, k -> ConcurrentHashMap.newKeySet()).add(email);
    }

    public void removeUser(Long sessionId, String email) {
        Set<String> users = sessionUsers.get(sessionId);
        if (users != null) {
            users.remove(email);
            if (users.isEmpty()) {
                sessionUsers.remove(sessionId);
            }
        }
    }

    public Set<String> getActiveUsers(Long sessionId) {
        return sessionUsers.getOrDefault(sessionId, Collections.emptySet());
    }

    public boolean isRoomEmpty(Long sessionId) {
        Set<String> users = sessionUsers.get(sessionId);
        return users == null || users.isEmpty();
    }
}
