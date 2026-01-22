package com.SkillSwap.PeerToPeerLearning.P3ResumePortal.AResumeService.IMPL;

import com.SkillSwap.PeerToPeerLearning.P1Auth.Entity.UserAuthEntity;
import com.SkillSwap.PeerToPeerLearning.P1Auth.Repository.UserAuthRepo;

import com.SkillSwap.PeerToPeerLearning.P3ResumePortal.AResumeService.ResumeService;
import com.SkillSwap.PeerToPeerLearning.P3ResumePortal.Certification.DTO.CertificationDto;
import com.SkillSwap.PeerToPeerLearning.P3ResumePortal.Certification.Entity.CertificationEntity;
import com.SkillSwap.PeerToPeerLearning.P3ResumePortal.Certification.Repository.CertificationRepository;
import com.SkillSwap.PeerToPeerLearning.P3ResumePortal.CoddingPlatform.DTO.CodingStatDto;
import com.SkillSwap.PeerToPeerLearning.P3ResumePortal.CoddingPlatform.Entity.CodingStatEntity;
import com.SkillSwap.PeerToPeerLearning.P3ResumePortal.CoddingPlatform.Repository.CodingStatRepository;
import com.SkillSwap.PeerToPeerLearning.P3ResumePortal.Education.DTO.EducationDto;
import com.SkillSwap.PeerToPeerLearning.P3ResumePortal.Education.Entity.EducationEntity;
import com.SkillSwap.PeerToPeerLearning.P3ResumePortal.Education.Repository.EducationRepository;
import com.SkillSwap.PeerToPeerLearning.P3ResumePortal.Experience.DTO.ExperienceDto;
import com.SkillSwap.PeerToPeerLearning.P3ResumePortal.Experience.Entity.ExperienceEntity;
import com.SkillSwap.PeerToPeerLearning.P3ResumePortal.Experience.Repository.ExperienceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class ResumeServiceImpl implements ResumeService {

    private final UserAuthRepo userAuthRepo;
    private final CertificationRepository certificationRepository;
    private final CodingStatRepository codingStatRepository;
    private final ExperienceRepository experienceRepository;
    private final EducationRepository educationRepository;

    // --- Core Helper: Finds User or throws 404 ---
    private UserAuthEntity findUserByEmail(String email) {
        return userAuthRepo.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found."));
    }

    // --- Authorization Helpers: Finds Entity by ID and User ID or throws 404 ---
    private CertificationEntity findCertificationByIdAndUser(Long id, Long userId) {
        return certificationRepository.findByIdAndUser_Id(id, userId).stream().findFirst()
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Certification not found or does not belong to user."));
    }

    private CodingStatEntity findCodingStatByIdAndUser(Long id, Long userId) {
        return codingStatRepository.findByIdAndUser_Id(id, userId).stream().findFirst()
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Coding stat not found or does not belong to user."));
    }

    private ExperienceEntity findExperienceByIdAndUser(Long id, Long userId) {
        return experienceRepository.findByIdAndUser_Id(id, userId).stream().findFirst()
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Experience not found or does not belong to user."));
    }

    private EducationEntity findEducationByIdAndUser(Long id, Long userId) {
        return educationRepository.findByIdAndUser_Id(id, userId).stream().findFirst()
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Education entry not found or does not belong to user."));
    }

    // --- 1. Certification CRUD Implementations ---

    @Override
    @Transactional(readOnly = true)
    public List<CertificationDto> getAllCertifications(String email) {
        UserAuthEntity user = findUserByEmail(email);
        return certificationRepository.findByUser_Id(user.getId()).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public CertificationDto createCertification(String email, CertificationDto dto) {
        UserAuthEntity user = findUserByEmail(email);
        CertificationEntity entity = mapToEntity(dto);
        entity.setUser(user);
        CertificationEntity savedEntity = certificationRepository.save(entity);
        return mapToDto(savedEntity);
    }

    @Override
    public CertificationDto updateCertification(String email, Long id, CertificationDto dto) {
        UserAuthEntity user = findUserByEmail(email);
        CertificationEntity entity = findCertificationByIdAndUser(id, user.getId());

        // Update fields
        entity.setSkillName(dto.getSkillName());
        entity.setCertificationName(dto.getCertificationName());
        entity.setIssuingOrganization(dto.getIssuingOrganization());
        entity.setIssueDate(dto.getIssueDate());
        entity.setExpirationDate(dto.getExpirationDate());
        entity.setProofUrl(dto.getProofUrl());

        CertificationEntity updatedEntity = certificationRepository.save(entity);
        return mapToDto(updatedEntity);
    }

    @Override
    public void deleteCertification(String email, Long id) {
        UserAuthEntity user = findUserByEmail(email);
        CertificationEntity entity = findCertificationByIdAndUser(id, user.getId());
        certificationRepository.delete(entity);
    }

    // --- 2. Coding Stat CRUD Implementations ---

    @Override
    @Transactional(readOnly = true)
    public List<CodingStatDto> getAllCodingStats(String email) {
        UserAuthEntity user = findUserByEmail(email);
        return codingStatRepository.findByUser_Id(user.getId()).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public CodingStatDto createCodingStat(String email, CodingStatDto dto) {
        UserAuthEntity user = findUserByEmail(email);
        CodingStatEntity entity = mapToEntity(dto);
        entity.setUser(user);

        CodingStatEntity savedEntity = codingStatRepository.save(entity);
        return mapToDto(savedEntity);
    }

    @Override
    public CodingStatDto updateCodingStat(String email, Long id, CodingStatDto dto) {
        UserAuthEntity user = findUserByEmail(email);
        CodingStatEntity entity = findCodingStatByIdAndUser(id, user.getId());

        // Update fields
        entity.setPlatformName(dto.getPlatformName());
        entity.setProfileUrl(dto.getProfileUrl());
        entity.setTotalProblemsSolved(dto.getTotalProblemsSolved());
        entity.setEasySolved(dto.getEasySolved());
        entity.setMediumSolved(dto.getMediumSolved());
        entity.setHardSolved(dto.getHardSolved());
        entity.setProofUrl(dto.getProofUrl());

        CodingStatEntity updatedEntity = codingStatRepository.save(entity);
        return mapToDto(updatedEntity);
    }

    @Override
    public void deleteCodingStat(String email, Long id) {
        UserAuthEntity user = findUserByEmail(email);
        CodingStatEntity entity = findCodingStatByIdAndUser(id, user.getId());

        codingStatRepository.delete(entity);
    }

    // --- 3. Experience CRUD Implementations ---

    @Override
    @Transactional(readOnly = true)
    public List<ExperienceDto> getAllExperiences(String email) {
        UserAuthEntity user = findUserByEmail(email);
        return experienceRepository.findByUser_Id(user.getId()).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public ExperienceDto createExperience(String email, ExperienceDto dto) {
        UserAuthEntity user = findUserByEmail(email);
        ExperienceEntity entity = mapToEntity(dto);
        entity.setUser(user);

        ExperienceEntity savedEntity = experienceRepository.save(entity);
        return mapToDto(savedEntity);
    }

    @Override
    public ExperienceDto updateExperience(String email, Long id, ExperienceDto dto) {
        UserAuthEntity user = findUserByEmail(email);
        ExperienceEntity entity = findExperienceByIdAndUser(id, user.getId());

        // Update fields
        entity.setJobTitle(dto.getJobTitle());
        entity.setCompanyName(dto.getCompanyName());
        entity.setSkillName(dto.getSkillName());
        entity.setStartDate(dto.getStartDate());
        entity.setEndDate(dto.getEndDate());
        entity.setDescription(dto.getDescription());
        entity.setProofUrl(dto.getProofUrl());

        ExperienceEntity updatedEntity = experienceRepository.save(entity);
        return mapToDto(updatedEntity);
    }

    @Override
    public void deleteExperience(String email, Long id) {
        UserAuthEntity user = findUserByEmail(email);
        ExperienceEntity entity = findExperienceByIdAndUser(id, user.getId());

        experienceRepository.delete(entity);
    }

    // --- 4. Education CRUD Implementations ---

    @Override
    @Transactional(readOnly = true)
    public List<EducationDto> getAllEducation(String email) {
        UserAuthEntity user = findUserByEmail(email);
        return educationRepository.findByUser_Id(user.getId()).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public EducationDto createEducation(String email, EducationDto dto) {
        UserAuthEntity user = findUserByEmail(email);
        EducationEntity entity = mapToEntity(dto);
        entity.setUser(user);

        EducationEntity savedEntity = educationRepository.save(entity);
        return mapToDto(savedEntity);
    }

    @Override
    public EducationDto updateEducation(String email, Long id, EducationDto dto) {
        UserAuthEntity user = findUserByEmail(email);
        EducationEntity entity = findEducationByIdAndUser(id, user.getId());

        // Update fields
        entity.setEducationLevel(dto.getEducationLevel());
        entity.setInstitutionName(dto.getInstitutionName());
        entity.setBoardOrUniversity(dto.getBoardOrUniversity());
        entity.setFieldOfStudy(dto.getFieldOfStudy());
        entity.setPassingYear(dto.getPassingYear());
        entity.setScoreDetails(dto.getScoreDetails());
        entity.setProofUrl(dto.getProofUrl());

        EducationEntity updatedEntity = educationRepository.save(entity);
        return mapToDto(updatedEntity);
    }

    @Override
    public void deleteEducation(String email, Long id) {
        UserAuthEntity user = findUserByEmail(email);
        EducationEntity entity = findEducationByIdAndUser(id, user.getId());

        educationRepository.delete(entity);
    }

    // --- Mapper methods (Moved to bottom for clarity) ---

    private CertificationDto mapToDto(CertificationEntity entity) {
        return CertificationDto.builder()
                .id(entity.getId())
                .skillName(entity.getSkillName())
                .certificationName(entity.getCertificationName())
                .issuingOrganization(entity.getIssuingOrganization())
                .issueDate(entity.getIssueDate())
                .expirationDate(entity.getExpirationDate())
                .proofUrl(entity.getProofUrl())
                .credibilityScore(
                        calculateCertificationCredibility(entity.getIssuingOrganization(), entity.getProofUrl()))
                .build();
    }

    private Double calculateCertificationCredibility(String issuer, String proofUrl) {
        double score = 0.5; // Base score
        if (issuer != null) {
            String lowerIssuer = issuer.toLowerCase();
            if (lowerIssuer.contains("spring") || lowerIssuer.contains("oracle") || lowerIssuer.contains("aws")
                    || lowerIssuer.contains("google") || lowerIssuer.contains("microsoft")) {
                score = 0.9;
            } else if (lowerIssuer.contains("udemy") || lowerIssuer.contains("coursera") || lowerIssuer.contains("edx")
                    || lowerIssuer.contains("pluralsight")) {
                score = 0.7;
            }
        }
        // Verification bonus
        if (proofUrl != null && !proofUrl.isBlank()) {
            score += 0.1;
        }
        return Math.min(score, 1.0);
    }

    private CertificationEntity mapToEntity(CertificationDto dto) {
        return CertificationEntity.builder()
                .skillName(dto.getSkillName())
                .certificationName(dto.getCertificationName())
                .issuingOrganization(dto.getIssuingOrganization())
                .issueDate(dto.getIssueDate())
                .expirationDate(dto.getExpirationDate())
                .proofUrl(dto.getProofUrl())
                .build();
    }

    private CodingStatDto mapToDto(CodingStatEntity entity) {
        return CodingStatDto.builder()
                .id(entity.getId())
                .platformName(entity.getPlatformName())
                .profileUrl(entity.getProfileUrl())
                .totalProblemsSolved(entity.getTotalProblemsSolved())
                .easySolved(entity.getEasySolved())
                .mediumSolved(entity.getMediumSolved())
                .hardSolved(entity.getHardSolved())
                .proofUrl(entity.getProofUrl())
                .build();
    }

    private CodingStatEntity mapToEntity(CodingStatDto dto) {
        return CodingStatEntity.builder()
                .platformName(dto.getPlatformName())
                .profileUrl(dto.getProfileUrl())
                .totalProblemsSolved(dto.getTotalProblemsSolved())
                .easySolved(dto.getEasySolved())
                .mediumSolved(dto.getMediumSolved())
                .hardSolved(dto.getHardSolved())
                .proofUrl(dto.getProofUrl())
                .build();
    }

    private ExperienceDto mapToDto(ExperienceEntity entity) {
        return ExperienceDto.builder()
                .id(entity.getId())
                .jobTitle(entity.getJobTitle())
                .companyName(entity.getCompanyName())
                .skillName(entity.getSkillName())
                .startDate(entity.getStartDate())
                .endDate(entity.getEndDate())
                .description(entity.getDescription())
                .proofUrl(entity.getProofUrl())
                .build();
    }

    private ExperienceEntity mapToEntity(ExperienceDto dto) {
        return ExperienceEntity.builder()
                .jobTitle(dto.getJobTitle())
                .companyName(dto.getCompanyName())
                .skillName(dto.getSkillName())
                .startDate(dto.getStartDate())
                .endDate(dto.getEndDate())
                .description(dto.getDescription())
                .proofUrl(dto.getProofUrl())
                .build();
    }

    private EducationDto mapToDto(EducationEntity entity) {
        return EducationDto.builder()
                .id(entity.getId())
                .educationLevel(entity.getEducationLevel())
                .institutionName(entity.getInstitutionName())
                .boardOrUniversity(entity.getBoardOrUniversity())
                .fieldOfStudy(entity.getFieldOfStudy())
                .passingYear(entity.getPassingYear())
                .scoreDetails(entity.getScoreDetails())
                .proofUrl(entity.getProofUrl())
                .build();
    }

    private EducationEntity mapToEntity(EducationDto dto) {
        return EducationEntity.builder()
                .educationLevel(dto.getEducationLevel())
                .institutionName(dto.getInstitutionName())
                .boardOrUniversity(dto.getBoardOrUniversity())
                .fieldOfStudy(dto.getFieldOfStudy())
                .passingYear(dto.getPassingYear())
                .scoreDetails(dto.getScoreDetails())
                .proofUrl(dto.getProofUrl())
                .build();
    }
}