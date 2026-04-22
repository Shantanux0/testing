-- 1. Users
INSERT INTO tbl_user_auth (id, email, name, password, user_id, is_account_verified, created_at, updated_at) VALUES 
(1, 'alice@example.com', 'Alice Wonderland', '$2a$10$3licqfBqRu5LfFEUB785qOZdw2J3RVMCVMeDNQ3BMWWKAIUr1jcXS', 'uuid-alice', true, NOW(), NOW()),
(2, 'lazyleet20@gmail.com', 'Lazy Leet', '$2a$10$bNIROPxF2tDjwIwb7RrY6uK5WdM9GccetqBcp1efFIIGggdFa0ptG', 'uuid-bob', true, NOW(), NOW()), -- Hash for password123
(3, 'david@example.com', 'David Beckham', '$2a$10$3licqfBqRu5LfFEUB785qOZdw2J3RVMCVMeDNQ3BMWWKAIUr1jcXS', 'uuid-david', true, NOW(), NOW()),
(4, 'kaleshantanu2260@gmail.com', 'Shantanu Kale', '$2a$10$3licqfBqRu5LfFEUB785qOZdw2J3RVMCVMeDNQ3BMWWKAIUr1jcXS', 'uuid-shantanu', true, NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET password = EXCLUDED.password;

-- 2. Profiles (Conflict on user_id)
INSERT INTO user_profiles (user_id, first_name, last_name, bio, profile_image_url, skills, skills_to_learn, location, hours_per_week, communication_pace, preferred_learning_method, learning_goal, profile_completeness_score, website, linkedin_url, github_url, interests, timezone, availability_schedule, goal_timeline, teaching_motivation, teaching_approach, preferred_language, domain_focus, created_at, updated_at) VALUES 
(1, 'Alice', 'Wonderland', 'I am a Java expert looking to learn Python.', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice', 'Java', 'Python', 'Demo City', 10, 'MODERATE', 'PAIR_PROGRAMMING', 'SKILL_SWAP', 95, 'https://alicewonderland.dev', 'https://linkedin.com/in/alicewonderland', 'https://github.com/alicewonderland', 'Open Source, Blogging', 'Asia/Kolkata', '{"Mon": ["18:00-21:00"]}', 'MEDIUM', 'REINFORCE_KNOWLEDGE', 'PROJECT_BASED', 'English', 'BACKEND', NOW(), NOW()),
(2, 'Lazy', 'Leet', 'Python backend dev wanting to switch to Enterprise Java.', 'https://api.dicebear.com/7.x/avataaars/svg?seed=LazyLeet', 'Python, Django', 'Java', 'Demo City', 10, 'MODERATE', 'PAIR_PROGRAMMING', 'SKILL_SWAP', 95, 'https://bobbuilder.dev', 'https://linkedin.com/in/bobbuilder', 'https://github.com/bobbuilder', 'IoT, Robotics', 'Asia/Kolkata', '{"Tue": ["18:00-21:00"]}', 'MEDIUM', 'NETWORKING', 'CONCEPT_FIRST', 'English', 'FULL_STACK', NOW(), NOW()),
(3, 'David', 'Beckham', 'Senior Backend Engineer wanting to learn modern Frontend.', 'https://api.dicebear.com/7.x/avataaars/svg?seed=David', 'Spring Boot, Microservices', 'React', 'Demo City', 10, 'MODERATE', 'PAIR_PROGRAMMING', 'SKILL_SWAP', 95, 'https://davidbeckham.dev', 'https://linkedin.com/in/davidbeckham', 'https://github.com/davidbeckham', 'Sports, AI', 'Asia/Kolkata', '{"Wed": ["18:00-21:00"]}', 'URGENT', 'BUILD_REPUTATION', 'PROBLEM_SOLVING', 'English', 'BACKEND', NOW(), NOW()),
(4, 'Shantanu', 'Kale', 'Full Stack Developer passionate about peer learning.', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Shantanu', 'Java, Spring Boot, React', 'System Design, Cloud Native, Python', 'Pune, India', 20, 'FAST', 'PROJECT_BASED', 'CAREER_SWITCH', 100, 'https://shantanu.dev', 'https://linkedin.com/in/shantanu', 'https://github.com/shantanu', 'Architecture, Cloud', 'Asia/Kolkata', '{"Sat": ["10:00-18:00"]}', 'URGENT', 'LOVE_TEACHING', 'STEP_BY_STEP', 'English', 'FULL_STACK', NOW(), NOW())
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

-- 6. Education (WHERE NOT EXISTS to prevent duplicates)
INSERT INTO user_education (user_auth_id, education_level, institution_name, board_or_university, field_of_study, passing_year, score_details, proof_url, created_at, updated_at)
SELECT * FROM (VALUES
(1, 'Bachelor''s Degree', 'MIT', 'MIT University', 'Computer Science', '2017', '3.9 GPA', 'https://example.com/edu/alice-btech', NOW(), NOW()),
(2, 'Bachelor''s Degree', 'IIT Bombay', 'IIT Bombay', 'Computer Science', '2019', '9.2 CGPA', 'https://example.com/edu/lazyleet-btech', NOW(), NOW()),
(2, '12th Grade', 'Kendriya Vidyalaya Mumbai', 'CBSE', NULL, '2015', '92%', 'https://example.com/edu/lazyleet-12', NOW(), NOW()),
(3, 'Master''s Degree', 'BITS Pilani', 'BITS Pilani', 'Software Engineering', '2020', '8.8 CGPA', 'https://example.com/edu/david-mtech', NOW(), NOW()),
(4, 'Bachelor''s Degree', 'Pune University', 'Savitribai Phule Pune University', 'Computer Engineering', '2021', '9.1 CGPA', 'https://example.com/edu/shantanu-be', NOW(), NOW()),
(4, '12th Grade', 'Fergusson College', 'HSC Board Maharashtra', NULL, '2017', '88%', 'https://example.com/edu/shantanu-12', NOW(), NOW())
) AS v(user_auth_id, education_level, institution_name, board_or_university, field_of_study, passing_year, score_details, proof_url, created_at, updated_at)
WHERE NOT EXISTS (
    SELECT 1 FROM user_education e
    WHERE e.user_auth_id = v.user_auth_id AND e.institution_name = v.institution_name
);

-- 7. Experience (WHERE NOT EXISTS to prevent duplicates)
INSERT INTO user_experience (user_auth_id, job_title, company_name, skill_name, start_date, end_date, description, proof_url, created_at, updated_at)
SELECT * FROM (VALUES
(1, 'Backend Engineer', 'Amazon', 'Java', '2017-07-01', '2021-09-01', 'Designed and maintained high-throughput Java microservices for order management.', 'https://example.com/exp/alice-amazon', NOW(), NOW()),
(1, 'Senior Software Engineer', 'Goldman Sachs', 'Java', '2021-10-01', NULL, 'Building trading platform components with Java and Spring Boot.', 'https://example.com/exp/alice-gs', NOW(), NOW()),
(2, 'Python Developer', 'Infosys', 'Python', '2019-08-01', '2022-06-01', 'Built REST APIs using Django and Python for enterprise clients.', 'https://example.com/exp/lazyleet-infosys', NOW(), NOW()),
(2, 'Senior Python Engineer', 'Startup Tech', 'Python', '2022-07-01', NULL, 'Leading the backend Python/Django infrastructure for a SaaS platform.', 'https://example.com/exp/lazyleet-startup', NOW(), NOW()),
(3, 'Backend Developer', 'TCS', 'Spring Boot', '2020-08-01', '2022-05-01', 'Developed microservices using Spring Boot for banking systems.', 'https://example.com/exp/david-tcs', NOW(), NOW()),
(3, 'Principal Engineer', 'Wipro', 'Microservices', '2022-06-01', NULL, 'Architecting cloud-native microservices solutions at scale.', 'https://example.com/exp/david-wipro', NOW(), NOW()),
(4, 'Full Stack Developer', 'Accenture', 'Java', '2021-07-01', '2023-01-01', 'Worked on Java Spring Boot backend and React frontend for enterprise portals.', 'https://example.com/exp/shantanu-acc', NOW(), NOW()),
(4, 'Open Source Contributor', 'Independent', 'React', '2023-02-01', NULL, 'Building and maintaining open-source React component libraries with 1k+ stars.', 'https://example.com/exp/shantanu-oss', NOW(), NOW())
) AS v(user_auth_id, job_title, company_name, skill_name, start_date, end_date, description, proof_url, created_at, updated_at)
WHERE NOT EXISTS (
    SELECT 1 FROM user_experience e
    WHERE e.user_auth_id = v.user_auth_id AND e.company_name = v.company_name AND e.job_title = v.job_title
);

-- 8. Coding Stats (WHERE NOT EXISTS to prevent duplicates)
INSERT INTO user_coding_stats (user_auth_id, platform_name, profile_url, total_problems_solved, easy_solved, medium_solved, hard_solved, proof_url, created_at, updated_at)
SELECT * FROM (VALUES
(1, 'LeetCode', 'https://leetcode.com/alicewonderland', 350, 150, 150, 50, 'https://example.com/stats/alice-lc', NOW(), NOW()),
(2, 'LeetCode', 'https://leetcode.com/lazyleet20', 420, 200, 180, 40, 'https://example.com/stats/lazyleet-lc', NOW(), NOW()),
(2, 'HackerRank', 'https://hackerrank.com/lazyleet20', 180, 100, 60, 20, 'https://example.com/stats/lazyleet-hr', NOW(), NOW()),
(3, 'LeetCode', 'https://leetcode.com/davidbeckham', 510, 200, 200, 110, 'https://example.com/stats/david-lc', NOW(), NOW()),
(4, 'LeetCode', 'https://leetcode.com/shantanukale', 600, 220, 250, 130, 'https://example.com/stats/shantanu-lc', NOW(), NOW()),
(4, 'CodeForces', 'https://codeforces.com/profile/shantanu', 200, 80, 90, 30, 'https://example.com/stats/shantanu-cf', NOW(), NOW())
) AS v(user_auth_id, platform_name, profile_url, total_problems_solved, easy_solved, medium_solved, hard_solved, proof_url, created_at, updated_at)
WHERE NOT EXISTS (
    SELECT 1 FROM user_coding_stats s
    WHERE s.user_auth_id = v.user_auth_id AND s.platform_name = v.platform_name
);

-- Reset sequence to match the highest ID (Fix for duplicate key error)
SELECT setval('tbl_user_auth_id_seq', (SELECT MAX(id) FROM tbl_user_auth));

-- 9. Seed Demo Sessions (WHERE NOT EXISTS to prevent duplicates)
-- Session 1: Alice (id=1) teaches Java to LazyLeet (id=2) — ACCEPTED (ready to start)
INSERT INTO swap_sessions (id, teacher_id, learner_id, skill_name, status, created_at, updated_at)
SELECT 1, 1, 2, 'Java', 'ACCEPTED', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM swap_sessions WHERE id = 1);

-- Session 2: David (id=3) teaches Spring Boot to Shantanu (id=4) — IN_PROGRESS
INSERT INTO swap_sessions (id, teacher_id, learner_id, skill_name, status, created_at, updated_at)
SELECT 2, 3, 4, 'Spring Boot', 'ACCEPTED', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM swap_sessions WHERE id = 2);

-- Reset session sequence
SELECT setval('swap_sessions_id_seq', (SELECT COALESCE(MAX(id), 1) FROM swap_sessions));
