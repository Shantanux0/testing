package com.SkillSwap.PeerToPeerLearning.P4testPortal.Controller;

import com.SkillSwap.PeerToPeerLearning.P4testPortal.DTO.*;
import com.SkillSwap.PeerToPeerLearning.P4testPortal.Service.IMPL.TestPortalService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/test")
@RequiredArgsConstructor

public class TestPortalController {

    private final TestPortalService testPortalService;

    @PostMapping("/generate")
    public ResponseEntity<TestResponse> generateTest(
            @Valid @RequestBody GenerateTestRequest request,
            Authentication authentication) {

        String email = authentication.getName();
        TestResponse response = testPortalService.generateTest(email, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/submit")
    public ResponseEntity<TestResultResponse> submitTest(
            @Valid @RequestBody SubmitTestRequest request,
            Authentication authentication) {

        String email = authentication.getName();
        TestResultResponse result = testPortalService.submitTest(email, request);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/history")
    public ResponseEntity<List<TestHistoryDto>> getTestHistory(Authentication authentication) {
        String email = authentication.getName();
        List<TestHistoryDto> history = testPortalService.getTestHistory(email);
        return ResponseEntity.ok(history);
    }

    @GetMapping("/{testId}")
    public ResponseEntity<TestResponse> getTest(
            @PathVariable Long testId,
            Authentication authentication) {

        String email = authentication.getName();
        TestResponse response = testPortalService.getTest(email, testId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/result/{testId}")
    public ResponseEntity<TestResultResponse> getTestResult(
            @PathVariable Long testId,
            Authentication authentication) {

        String email = authentication.getName();
        TestResultResponse result = testPortalService.getTestResult(email, testId);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/qualification-status")
    public ResponseEntity<QualificationStatusResponse> checkQualificationStatus(
            @RequestParam String skill,
            Authentication authentication) {

        String email = authentication.getName();
        boolean isQualified = testPortalService.isUserQualifiedForSkill(email, skill);

        QualificationStatusResponse response = QualificationStatusResponse.builder()
                .skillName(skill)
                .isQualified(isQualified)
                .build();

        return ResponseEntity.ok(response);
    }
}
