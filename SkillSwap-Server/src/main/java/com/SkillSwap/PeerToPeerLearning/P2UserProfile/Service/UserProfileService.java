package com.SkillSwap.PeerToPeerLearning.P2UserProfile.Service;

import com.SkillSwap.PeerToPeerLearning.P2UserProfile.Dto.UserProfileResponseDto;
import com.SkillSwap.PeerToPeerLearning.P2UserProfile.Dto.UserProfileUpdateDto;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.transaction.annotation.Transactional;

public interface UserProfileService {
    UserProfileResponseDto getProfileByEmail(String email);
    UserProfileResponseDto updateProfile(String email, UserProfileUpdateDto profileDto);
    UserProfileResponseDto createProfile(String email, UserProfileUpdateDto profileDto);
    void deleteProfile(String email);
    Page<UserProfileResponseDto> searchProfiles(String keyword, Pageable pageable);


}