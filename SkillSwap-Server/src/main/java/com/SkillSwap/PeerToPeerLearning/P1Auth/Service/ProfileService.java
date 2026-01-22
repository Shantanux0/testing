package com.SkillSwap.PeerToPeerLearning.P1Auth.Service;

import com.SkillSwap.PeerToPeerLearning.P1Auth.Dto.ProfileRequest;
import com.SkillSwap.PeerToPeerLearning.P1Auth.Dto.ProfileResponse;
import org.springframework.stereotype.Service;

@Service
public interface ProfileService {
    ProfileResponse createProfile(ProfileRequest request);
    ProfileResponse getProfile(String email);
    void sendResetOtp (String email);
    void resetPassword(String email , String otp , String NewPassword);
    void sendOtp(String email);
    void verifyOtp(String Otp,String email);
}
