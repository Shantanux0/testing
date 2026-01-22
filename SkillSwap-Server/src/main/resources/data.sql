-- 1. Users
INSERT INTO tbl_user_auth (id, email, name, password, user_id, is_account_verified, created_at, updated_at) VALUES 
(1, 'alice@example.com', 'Alice Wonderland', '$2a$10$3licqfBqRu5LfFEUB785qOZdw2J3RVMCVMeDNQ3BMWWKAIUr1jcXS', 'uuid-alice', true, NOW(), NOW()),
(2, 'bob@example.com', 'Bob Builder', '$2a$10$3licqfBqRu5LfFEUB785qOZdw2J3RVMCVMeDNQ3BMWWKAIUr1jcXS', 'uuid-bob', true, NOW(), NOW()),
(3, 'david@example.com', 'David Beckham', '$2a$10$3licqfBqRu5LfFEUB785qOZdw2J3RVMCVMeDNQ3BMWWKAIUr1jcXS', 'uuid-david', true, NOW(), NOW()),
(4, 'kaleshantanu2260@gmail.com', 'Shantanu Kale', '$2a$10$3licqfBqRu5LfFEUB785qOZdw2J3RVMCVMeDNQ3BMWWKAIUr1jcXS', 'uuid-shantanu', true, NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET password = EXCLUDED.password;

-- 2. Profiles (Conflict on user_id)
INSERT INTO user_profiles (user_id, first_name, last_name, bio, profile_image_url, skills, skills_to_learn, location, hours_per_week, communication_pace, preferred_learning_method, learning_goal, profile_completeness_score, website, linkedin_url, github_url, interests, timezone, availability_schedule, goal_timeline, teaching_motivation, teaching_approach, preferred_language, domain_focus, created_at, updated_at) VALUES 
(1, 'Alice', 'Wonderland', 'I am a Java expert looking to learn Python.', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice', 'Java', 'Python', 'Demo City', 10, 'MODERATE', 'PAIR_PROGRAMMING', 'SKILL_SWAP', 95, 'https://alicewonderland.dev', 'https://linkedin.com/in/alicewonderland', 'https://github.com/alicewonderland', 'Open Source, Blogging', 'Asia/Kolkata', '{"Mon": ["18:00-21:00"]}', 'MEDIUM', 'REINFORCE_KNOWLEDGE', 'PROJECT_BASED', 'English', 'BACKEND', NOW(), NOW()),
(2, 'Bob', 'Builder', 'Python backend dev wanting to switch to Enterprise Java.', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob', 'Python, Django', 'Java', 'Demo City', 10, 'MODERATE', 'PAIR_PROGRAMMING', 'SKILL_SWAP', 95, 'https://bobbuilder.dev', 'https://linkedin.com/in/bobbuilder', 'https://github.com/bobbuilder', 'IoT, Robotics', 'Asia/Kolkata', '{"Tue": ["18:00-21:00"]}', 'MEDIUM', 'NETWORKING', 'CONCEPT_FIRST', 'English', 'FULL_STACK', NOW(), NOW()),
(3, 'David', 'Beckham', 'Senior Backend Engineer wanting to learn modern Frontend.', 'https://api.dicebear.com/7.x/avataaars/svg?seed=David', 'Spring Boot, Microservices', 'React', 'Demo City', 10, 'MODERATE', 'PAIR_PROGRAMMING', 'SKILL_SWAP', 95, 'https://davidbeckham.dev', 'https://linkedin.com/in/davidbeckham', 'https://github.com/davidbeckham', 'Sports, AI', 'Asia/Kolkata', '{"Wed": ["18:00-21:00"]}', 'URGENT', 'BUILD_REPUTATION', 'PROBLEM_SOLVING', 'English', 'BACKEND', NOW(), NOW()),
(4, 'Shantanu', 'Kale', 'Full Stack Developer passionate about peer learning.', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Shantanu', 'Java, Spring Boot, React', 'System Design, Cloud Native', 'Pune, India', 20, 'FAST', 'PROJECT_BASED', 'CAREER_SWITCH', 100, 'https://shantanu.dev', 'https://linkedin.com/in/shantanu', 'https://github.com/shantanu', 'Architecture, Cloud', 'Asia/Kolkata', '{"Sat": ["10:00-18:00"]}', 'URGENT', 'LOVE_TEACHING', 'STEP_BY_STEP', 'English', 'FULL_STACK', NOW(), NOW())
ON CONFLICT (user_id) DO NOTHING;

-- 3. Skills (Expert Level)
INSERT INTO user_skill_levels (user_id, skill_name, proficiency_level, years_of_experience, self_rating, willing_to_teach, projects_completed, created_at, updated_at) VALUES 
(1, 'Java', 'EXPERT', 5, 5, true, 10, NOW(), NOW()),
(2, 'Python', 'EXPERT', 4, 5, true, 8, NOW(), NOW()),
(2, 'Django', 'EXPERT', 3, 5, true, 5, NOW(), NOW()),
(3, 'Spring Boot', 'EXPERT', 6, 5, true, 12, NOW(), NOW()),
(3, 'Microservices', 'EXPERT', 4, 5, true, 7, NOW(), NOW()),
(4, 'Java', 'EXPERT', 5, 5, true, 15, NOW(), NOW()),
(4, 'Spring Boot', 'EXPERT', 4, 5, true, 10, NOW(), NOW()),
(4, 'React', 'EXPERT', 3, 5, true, 20, NOW(), NOW())
ON CONFLICT (user_id, skill_name) DO NOTHING;

-- 4. Test Results (No unique constraint -> Use WHERE NOT EXISTS)
INSERT INTO user_skill_tests (user_auth_id, skill_name, difficulty_level, questions_json, answers_json, total_questions, score, passing_score, is_passed, test_status, test_expires_at, ai_provider, created_at, updated_at)
SELECT * FROM (VALUES 
(1, 'Java', 'HARD', '[]', '[]', 15, 15, 10, true, 'COMPLETED', 1999999999999, 'MANUAL', NOW(), NOW()),
(2, 'Python', 'HARD', '[]', '[]', 15, 15, 10, true, 'COMPLETED', 1999999999999, 'MANUAL', NOW(), NOW()),
(2, 'Django', 'HARD', '[]', '[]', 15, 15, 10, true, 'COMPLETED', 1999999999999, 'MANUAL', NOW(), NOW()),
(3, 'Spring Boot', 'HARD', '[]', '[]', 15, 15, 10, true, 'COMPLETED', 1999999999999, 'MANUAL', NOW(), NOW()),
(3, 'Microservices', 'HARD', '[]', '[]', 15, 15, 10, true, 'COMPLETED', 1999999999999, 'MANUAL', NOW(), NOW()),
(4, 'Java', 'HARD', '[]', '[]', 15, 15, 10, true, 'COMPLETED', 1999999999999, 'MANUAL', NOW(), NOW()),
(4, 'Spring Boot', 'HARD', '[]', '[]', 15, 15, 10, true, 'COMPLETED', 1999999999999, 'MANUAL', NOW(), NOW()),
(4, 'React', 'HARD', '[]', '[]', 15, 15, 10, true, 'COMPLETED', 1999999999999, 'MANUAL', NOW(), NOW())
) AS v(user_auth_id, skill_name, difficulty_level, questions_json, answers_json, total_questions, score, passing_score, is_passed, test_status, test_expires_at, ai_provider, created_at, updated_at)
WHERE NOT EXISTS (
    SELECT 1 FROM user_skill_tests t 
    WHERE t.user_auth_id = v.user_auth_id AND t.skill_name = v.skill_name
);

-- 5. Certifications (No unique constraint -> Use WHERE NOT EXISTS)
INSERT INTO user_certifications (user_auth_id, skill_name, certification_name, issuing_organization, issue_date, expiration_date, proof_url, created_at, updated_at)
SELECT * FROM (VALUES
(1, 'Java', 'Oracle Certified Professional: Java SE 17 Developer', 'Oracle', '2023-01-15', NULL, 'https://example.com/cert/alice-java', NOW(), NOW()),
(2, 'Python', 'Certified Entry-Level Python Programmer', 'Python Institute', '2022-11-20', NULL, 'https://example.com/cert/bob-python', NOW(), NOW()),
(2, 'Django', 'Django Professional Certificate', 'Django Software Foundation', '2023-03-10', NULL, 'https://example.com/cert/bob-django', NOW(), NOW()),
(3, 'Spring Boot', 'Spring Certified Professional', 'VMware', '2023-05-01', NULL, 'https://example.com/cert/david-spring', NOW(), NOW()),
(4, 'Java', 'Oracle Certified Master', 'Oracle', '2022-06-01', NULL, 'https://example.com/cert/shantanu-java', NOW(), NOW()),
(4, 'Spring Boot', 'Spring Expert Certification', 'VMware', '2023-02-15', NULL, 'https://example.com/cert/shantanu-spring', NOW(), NOW()),
(4, 'React', 'Meta Front-End Developer Certificate', 'Meta', '2023-08-20', NULL, 'https://example.com/cert/shantanu-react', NOW(), NOW())
) AS v(user_auth_id, skill_name, certification_name, issuing_organization, issue_date, expiration_date, proof_url, created_at, updated_at)
WHERE NOT EXISTS (
    SELECT 1 FROM user_certifications c 
    WHERE c.user_auth_id = v.user_auth_id AND c.skill_name = v.skill_name
);
