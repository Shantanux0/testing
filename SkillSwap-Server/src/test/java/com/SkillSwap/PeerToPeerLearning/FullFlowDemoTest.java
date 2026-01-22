package com.SkillSwap.PeerToPeerLearning;

import com.SkillSwap.PeerToPeerLearning.P1Auth.Entity.UserAuthEntity;
import com.SkillSwap.PeerToPeerLearning.P1Auth.Repository.UserAuthRepo;
import com.SkillSwap.PeerToPeerLearning.P2UserProfile.Repository.UserProfileRepository;
import com.SkillSwap.PeerToPeerLearning.P2UserProfile.entity.UserProfileEntity;
import com.SkillSwap.PeerToPeerLearning.P3ResumePortal.AResumeService.ResumeService;
import com.SkillSwap.PeerToPeerLearning.P3ResumePortal.Certification.DTO.CertificationDto;
import com.SkillSwap.PeerToPeerLearning.P4testPortal.Service.IMPL.TestPortalService;
import com.SkillSwap.PeerToPeerLearning.P5SkillMatch.Dto.MatchResponseDto;
import com.SkillSwap.PeerToPeerLearning.P5SkillMatch.Service.SkillMatchService;
import com.SkillSwap.PeerToPeerLearning.P6Feedback.Service.ReputationService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class FullFlowDemoTest {

    @Mock
    private UserProfileRepository userProfileRepository;
    @Mock
    private UserAuthRepo userAuthRepo;
    @Mock
    private TestPortalService testPortalService;
    @Mock
    private ResumeService resumeService;
    @Mock
    private ReputationService reputationService;

    @InjectMocks
    private SkillMatchService skillMatchService;

    @Test
    public void testScenario_AliceMatchesBob() {
        // --- 1. DATA SETUP ---
        String skill = "Spring Boot";

        // Bob (Learner)
        UserAuthEntity bob = UserAuthEntity.builder().id(2L).email("bob@test.com").build();
        when(userAuthRepo.findByEmail("bob@test.com")).thenReturn(Optional.of(bob));

        // Alice (Teacher)
        UserAuthEntity aliceUser = UserAuthEntity.builder().id(1L).email("alice@test.com").build();
        UserProfileEntity aliceProfile = new UserProfileEntity();
        aliceProfile.setUser(aliceUser);
        aliceProfile.setFirstName("Alice");
        aliceProfile.setLastName("Wonder");
        aliceProfile.setSkills("Java, Spring Boot"); // Matches skill

        // Mock Repository finding Alice
        when(userProfileRepository.findAll()).thenReturn(List.of(aliceProfile));

        // --- 2. MOCK SCORES ---

        // Test Score: Alice scored 93% on the test
        when(testPortalService.getBestTestScore(1L, skill)).thenReturn(0.93);

        // Cert Score: Alice has an Oracle Cert (Score 1.0)
        CertificationDto oracleCert = CertificationDto.builder()
                .skillName(skill)
                .certificationName("Oracle Certified")
                .issuingOrganization("Oracle") // Smart credibility logic would score this high
                .credibilityScore(1.0) // Mocking the service result directly
                .build();
        when(resumeService.getAllCertifications("alice@test.com")).thenReturn(List.of(oracleCert));

        // Reputation: Alice has 5.0 stars (Normalized = 1.0)
        when(reputationService.getUserReputation(1L)).thenReturn(5.0);

        // --- 3. RUN MATCHING ---
        List<MatchResponseDto> matches = skillMatchService.recommendTeachers("bob@test.com", skill);

        // --- 4. ASSERTIONS ---
        assertEquals(1, matches.size());
        MatchResponseDto match = matches.get(0);

        System.out.println("Match Found: " + match.getName());
        System.out.println("Match Score: " + match.getMatchScore());

        // Calculation:
        // Test (0.93 * 0.4) = 0.372
        // Cert (1.00 * 0.3) = 0.300
        // Rep (1.00 * 0.3) = 0.300
        // Total = 0.972
        assertEquals(0.972, match.getMatchScore(), 0.001);
    }
}
