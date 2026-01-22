package com.SkillSwap.PeerToPeerLearning.P3ResumePortal.AResumeService;

import com.SkillSwap.PeerToPeerLearning.P3ResumePortal.Certification.DTO.CertificationDto;
import com.SkillSwap.PeerToPeerLearning.P3ResumePortal.CoddingPlatform.DTO.CodingStatDto;
import com.SkillSwap.PeerToPeerLearning.P3ResumePortal.Education.DTO.EducationDto;
import com.SkillSwap.PeerToPeerLearning.P3ResumePortal.Experience.DTO.ExperienceDto;

import java.util.List;

public interface ResumeService {

    // --- 1. Certification CRUD operations ---
    List<CertificationDto> getAllCertifications(String email);
    CertificationDto createCertification(String email, CertificationDto dto);
    CertificationDto updateCertification(String email, Long id, CertificationDto dto);
    void deleteCertification(String email, Long id);

    // --- 2. Coding Stat CRUD operations ---
    List<CodingStatDto> getAllCodingStats(String email);
    CodingStatDto createCodingStat(String email, CodingStatDto dto);
    CodingStatDto updateCodingStat(String email, Long id, CodingStatDto dto);
    void deleteCodingStat(String email, Long id);

    // --- 3. Experience CRUD operations ---
    List<ExperienceDto> getAllExperiences(String email);
    ExperienceDto createExperience(String email, ExperienceDto dto);
    ExperienceDto updateExperience(String email, Long id, ExperienceDto dto);
    void deleteExperience(String email, Long id);

    // --- 4. Education CRUD operations ---
    List<EducationDto> getAllEducation(String email);
    EducationDto createEducation(String email, EducationDto dto);
    EducationDto updateEducation(String email, Long id, EducationDto dto);
    void deleteEducation(String email, Long id);
}