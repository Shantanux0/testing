package com.SkillSwap.PeerToPeerLearning.P3ResumePortal.AResumeController;

import com.SkillSwap.PeerToPeerLearning.P3ResumePortal.AResumeService.ResumeService;
import com.SkillSwap.PeerToPeerLearning.P3ResumePortal.Certification.DTO.CertificationDto;
import com.SkillSwap.PeerToPeerLearning.P3ResumePortal.CoddingPlatform.DTO.CodingStatDto;
import com.SkillSwap.PeerToPeerLearning.P3ResumePortal.Education.DTO.EducationDto;
import com.SkillSwap.PeerToPeerLearning.P3ResumePortal.Experience.DTO.ExperienceDto;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/resume")
@RequiredArgsConstructor

public class ResumeController {

    private final ResumeService resumeService;

    // --- 1. CERTIFICATIONS ENDPOINTS (/api/resume/certifications) ---

    @GetMapping("/certifications")
    public ResponseEntity<List<CertificationDto>> getAllCertifications(Authentication authentication) {
        String email = authentication.getName();
        List<CertificationDto> certifications = resumeService.getAllCertifications(email);
        return ResponseEntity.ok(certifications);
    }

    @PostMapping("/certifications")
    public ResponseEntity<CertificationDto> createCertification(
            @Valid @RequestBody CertificationDto dto,
            Authentication authentication) {
        String email = authentication.getName();
        CertificationDto createdCert = resumeService.createCertification(email, dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdCert);
    }

    @PutMapping("/certifications/{id}")
    public ResponseEntity<CertificationDto> updateCertification(
            @PathVariable Long id,
            @Valid @RequestBody CertificationDto dto,
            Authentication authentication) {
        String email = authentication.getName();
        CertificationDto updatedCert = resumeService.updateCertification(email, id, dto);
        return ResponseEntity.ok(updatedCert);
    }

    @DeleteMapping("/certifications/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteCertification(
            @PathVariable Long id,
            Authentication authentication) {
        String email = authentication.getName();
        resumeService.deleteCertification(email, id);
    }

    // --- 2. CODING STATS ENDPOINTS (/api/resume/coding-stats) ---

    @GetMapping("/coding-stats")
    public ResponseEntity<List<CodingStatDto>> getAllCodingStats(Authentication authentication) {
        String email = authentication.getName();
        List<CodingStatDto> stats = resumeService.getAllCodingStats(email);
        return ResponseEntity.ok(stats);
    }

    @PostMapping("/coding-stats")
    public ResponseEntity<CodingStatDto> createCodingStat(
            @Valid @RequestBody CodingStatDto dto,
            Authentication authentication) {
        String email = authentication.getName();
        CodingStatDto createdStat = resumeService.createCodingStat(email, dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdStat);
    }

    @PutMapping("/coding-stats/{id}")
    public ResponseEntity<CodingStatDto> updateCodingStat(
            @PathVariable Long id,
            @Valid @RequestBody CodingStatDto dto,
            Authentication authentication) {
        String email = authentication.getName();
        CodingStatDto updatedStat = resumeService.updateCodingStat(email, id, dto);
        return ResponseEntity.ok(updatedStat);
    }

    @DeleteMapping("/coding-stats/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteCodingStat(
            @PathVariable Long id,
            Authentication authentication) {
        String email = authentication.getName();
        resumeService.deleteCodingStat(email, id);
    }

    // --- 3. EXPERIENCE ENDPOINTS (/api/resume/experience) ---

    @GetMapping("/experience")
    public ResponseEntity<List<ExperienceDto>> getAllExperiences(Authentication authentication) {
        String email = authentication.getName();
        List<ExperienceDto> experiences = resumeService.getAllExperiences(email);
        return ResponseEntity.ok(experiences);
    }

    @PostMapping("/experience")
    public ResponseEntity<ExperienceDto> createExperience(
            @Valid @RequestBody ExperienceDto dto,
            Authentication authentication) {
        String email = authentication.getName();
        ExperienceDto createdExperience = resumeService.createExperience(email, dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdExperience);
    }

    @PutMapping("/experience/{id}")
    public ResponseEntity<ExperienceDto> updateExperience(
            @PathVariable Long id,
            @Valid @RequestBody ExperienceDto dto,
            Authentication authentication) {
        String email = authentication.getName();
        ExperienceDto updatedExperience = resumeService.updateExperience(email, id, dto);
        return ResponseEntity.ok(updatedExperience);
    }

    @DeleteMapping("/experience/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteExperience(
            @PathVariable Long id,
            Authentication authentication) {
        String email = authentication.getName();
        resumeService.deleteExperience(email, id);
    }

    // --- 4. EDUCATION ENDPOINTS (/api/resume/education) ---

    @GetMapping("/education")
    public ResponseEntity<List<EducationDto>> getAllEducation(Authentication authentication) {
        String email = authentication.getName();
        List<EducationDto> education = resumeService.getAllEducation(email);
        return ResponseEntity.ok(education);
    }

    @PostMapping("/education")
    public ResponseEntity<EducationDto> createEducation(
            @Valid @RequestBody EducationDto dto,
            Authentication authentication) {
        String email = authentication.getName();
        EducationDto createdEducation = resumeService.createEducation(email, dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdEducation);
    }

    @PutMapping("/education/{id}")
    public ResponseEntity<EducationDto> updateEducation(
            @PathVariable Long id,
            @Valid @RequestBody EducationDto dto,
            Authentication authentication) {
        String email = authentication.getName();
        EducationDto updatedEducation = resumeService.updateEducation(email, id, dto);
        return ResponseEntity.ok(updatedEducation);
    }

    @DeleteMapping("/education/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteEducation(
            @PathVariable Long id,
            Authentication authentication) {
        String email = authentication.getName();
        resumeService.deleteEducation(email, id);
    }
}