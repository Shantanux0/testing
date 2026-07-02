package com.SkillSwap.PeerToPeerLearning.P4testPortal.Service.IMPL;

import com.SkillSwap.PeerToPeerLearning.P4testPortal.DTO.TestQuestion;

import java.util.*;
import java.util.stream.Collectors;

public final class StaticQuestionBank {

    private StaticQuestionBank() {}

    // canonical skill keys (lowercase)
    private static final String JAVA = "java";
    private static final String SPRING_BOOT = "spring boot";
    private static final String REACT = "react";
    private static final String PYTHON = "python";

    // alias map → canonical key
    private static final Map<String, String> ALIASES = Map.ofEntries(
            Map.entry("java", JAVA),
            Map.entry("core java", JAVA),
            Map.entry("advanced java", JAVA),
            Map.entry("spring boot", SPRING_BOOT),
            Map.entry("spring", SPRING_BOOT),
            Map.entry("spring-boot", SPRING_BOOT),
            Map.entry("springboot", SPRING_BOOT),
            Map.entry("react", REACT),
            Map.entry("reactjs", REACT),
            Map.entry("react.js", REACT),
            Map.entry("react js", REACT),
            Map.entry("python", PYTHON),
            Map.entry("python3", PYTHON),
            Map.entry("python 3", PYTHON)
    );

    private static final Map<String, List<TestQuestion>> BANK = new HashMap<>();

    static {
        BANK.put(JAVA, buildJava());
        BANK.put(SPRING_BOOT, buildSpringBoot());
        BANK.put(REACT, buildReact());
        BANK.put(PYTHON, buildPython());
    }

    /** Returns an immutable list of exactly 15 questions for the recognized skill. */
    public static List<TestQuestion> getQuestionsOrThrow(String skillName) {
        String key = normalize(skillName);
        String canonical = ALIASES.get(key);
        if (canonical == null || !BANK.containsKey(canonical)) {
            throw new IllegalArgumentException("Unsupported skill: " + skillName +
                    ". Supported: " + new TreeSet<>(BANK.keySet()));
        }
        // deep copy so callers can't mutate our bank
        return BANK.get(canonical).stream().map(StaticQuestionBank::copy).collect(Collectors.toUnmodifiableList());
    }

    private static String normalize(String s) {
        return s == null ? "" : s.trim().toLowerCase(Locale.ROOT);
    }

    private static TestQuestion copy(TestQuestion q) {
        return TestQuestion.builder()
                .questionNumber(q.getQuestionNumber())
                .question(q.getQuestion())
                .options(new ArrayList<>(q.getOptions()))
                .correctAnswer(q.getCorrectAnswer())
                .build();
    }

    // -------------------- JAVA (15) --------------------
    private static List<TestQuestion> buildJava() {
        List<TestQuestion> list = new ArrayList<>();
        int i = 1;
        list.add(q(i++, "Which statement about Java memory model is TRUE regarding 'volatile'?", o("A. It prevents instruction reordering and guarantees atomicity for all operations", "B. It guarantees visibility across threads but not atomicity for compound actions", "C. It is equivalent to 'synchronized'", "D. It only affects writes, not reads"), "B"));
        list.add(q(i++, "Which collection has O(1) average-time contains() and does NOT preserve insertion order?", o("A. LinkedHashSet", "B. HashSet", "C. TreeSet", "D. CopyOnWriteArraySet"), "B"));
        list.add(q(i++, "What happens if close() throws in try-with-resources when the try block also throws?", o("A. close() exception replaces the try exception", "B. Both are lost", "C. Try exception is primary; close() is suppressed", "D. Both are thrown to caller simultaneously"), "C"));
        list.add(q(i++, "Which is TRUE about CompletableFuture.allOf(f1, f2)?", o("A. Returns first completed future's value", "B. Returns a future completed when ALL are complete", "C. Cancels others when one fails", "D. Aggregates results into List automatically"), "B"));
        list.add(q(i++, "Sealed classes (Java 17) allow:", o("A. Runtime-only restrictions", "B. Compile-time control over which classes may extend/implement", "C. Preventing reflection", "D. Automatic pattern matching in streams"), "B"));
        list.add(q(i++, "Which Stream operation is STATEFUL?", o("A. map", "B. filter", "C. sorted", "D. flatMap"), "C"));
        list.add(q(i++, "Records in Java:", o("A. Are mutable data carriers with synthesized equals/hashCode", "B. Are immutable by default; fields are final", "C. Cannot implement interfaces", "D. Cannot define methods"), "B"));
        list.add(q(i++, "Which is TRUE about String interning?", o("A. new String(\"x\") is interned automatically", "B. \"x\" literals are interned by the compiler", "C. intern() creates a new object every time", "D. Intern pool is per-thread"), "B"));
        list.add(q(i++, "Which ExecutorService method prevents new tasks and waits for running tasks to finish?", o("A. shutdownNow()", "B. awaitTermination()", "C. shutdown()", "D. terminate()"), "C"));
        list.add(q(i++, "Which option avoids lost updates in concurrent increments to a long counter?", o("A. volatile long c; c++;", "B. LongAdder or AtomicLong incrementAndGet()", "C. synchronized(c) { c++; }", "D. Using final long"), "B"));
        list.add(q(i++, "Pattern matching for 'instanceof' enables:", o("A. Casting at runtime only", "B. Combining null-check and cast", "C. Binding a typed variable on success", "D. Compile-time devirtualization"), "C"));
        list.add(q(i++, "Which is true for Optional?", o("A. Serializable and recommended for fields", "B. Intended for return types; not for fields/params", "C. Replaces null everywhere", "D. Thread-safe container with lock"), "B"));
        list.add(q(i++, "What does 'var' in Java (local variable type inference) do?", o("A. Is dynamic typing at runtime", "B. Infers static type at compile time", "C. Is equivalent to Object", "D. Works in fields and method params"), "B"));
        list.add(q(i++, "Which GC tuning goal reduces pause times the MOST predictably?", o("A. Single-threaded Serial GC", "B. G1 with pause target", "C. CMS", "D. Epsilon GC"), "B"));
        list.add(q(i++, "When using equals/hashCode, which is recommended?", o("A. Compare mutable fields only", "B. Use Objects.hash and compare significant fields", "C. Ignore symmetry/transitivity", "D. Always rely on identity hash"), "B"));
        return list;
    }

    // -------------------- SPRING BOOT (15) --------------------
    private static List<TestQuestion> buildSpringBoot() {
        List<TestQuestion> list = new ArrayList<>();
        int i = 1;
        list.add(q(i++, "Which statement about @ConfigurationProperties is TRUE?", o("A. Requires @EnableConfigurationProperties only on test scope", "B. Binds externalized config to beans with type-safe metadata", "C. Must be used with @Value on each field", "D. Only works for YAML, not properties"), "B"));
        list.add(q(i++, "What does @ConditionalOnMissingBean do?", o("A. Creates bean if an alias is missing", "B. Creates bean only if no bean of that type/name already exists", "C. Fails the context if bean missing", "D. Disables autoconfiguration"), "B"));
        list.add(q(i++, "Spring Boot actuator /health endpoint by default:", o("A. Exposes complete health details to everyone", "B. Is disabled", "C. Exposes status; details based on management config", "D. Requires OAuth2"), "C"));
        list.add(q(i++, "Which cache abstraction is correct?", o("A. @Cacheable runs method and THEN caches always", "B. @CachePut bypasses method", "C. @CacheEvict removes entries", "D. Cache names must match bean names"), "C"));
        list.add(q(i++, "In Spring Security 6+, the recommended way to define HTTP security is:", o("A. WebSecurityConfigurerAdapter", "B. SecurityFilterChain bean", "C. @EnableWebSecurity with defaults", "D. application.properties only"), "B"));
        list.add(q(i++, "What does @Transactional on a public service method guarantee by default (JPA)?", o("A. New transaction always", "B. Join existing or create new (REQUIRED)", "C. Read-only isolation at REPEATABLE_READ", "D. SERIALIZABLE isolation"), "B"));
        list.add(q(i++, "Spring Boot profiles allow:", o("A. Selecting bean definitions based on active profile(s)", "B. Changing Java version at runtime", "C. Live reloading of classes", "D. Overriding @Bean names dynamically"), "A"));
        list.add(q(i++, "With @RestController, returning a POJO by default is:", o("A. Rendered as Thymeleaf view", "B. Serialized as JSON via HttpMessageConverters", "C. Ignored; must add @ResponseBody", "D. Requires @EnableWebMvc"), "B"));
        list.add(q(i++, "Which statement about @ComponentScan is TRUE in Spring Boot?", o("A. It is disabled; beans must be manual", "B. It scans from the package of the @SpringBootApplication class downward by default", "C. It scans the whole classpath", "D. It only scans 'service' packages"), "B"));
        list.add(q(i++, "Which Starter adds Spring Data JPA + Hibernate?", o("A. spring-boot-starter-web", "B. spring-boot-starter-data-jpa", "C. spring-boot-starter-jdbc", "D. spring-boot-starter-actuator"), "B"));
        list.add(q(i++, "What does @Validated on a controller method param do with @Valid constraints?", o("A. Nothing; only @Valid works", "B. Enables group validation, method-level constraints, and integration with BindingResult", "C. Forces bean creation", "D. Disables constraint violations"), "B"));
        list.add(q(i++, "Which is TRUE about @Lazy?", o("A. Forces immediate initialization", "B. Defers bean creation until first use or injection", "C. Only works on controllers", "D. Only for prototype scope"), "B"));
        list.add(q(i++, "How do you customize Jackson ObjectMapper in Boot?", o("A. Replace spring-boot-starter-json", "B. Define a @Bean of type Jackson2ObjectMapperBuilderCustomizer or ObjectMapper", "C. You cannot; fixed", "D. Use @JsonConfig on main class"), "B"));
        list.add(q(i++, "Spring Boot externalized configuration precedence (highest wins) typically is:", o("A. application.properties < env vars < command-line args", "B. env vars < application.properties < command-line args", "C. command-line args < env vars < application.properties", "D. random"), "A"));
        list.add(q(i++, "What does @EnableScheduling provide?", o("A. Enables @Scheduled task execution", "B. Enables Quartz only", "C. Enables @Async", "D. Enables caching"), "A"));
        return list;
    }

    // -------------------- REACT (15) --------------------
    private static List<TestQuestion> buildReact() {
        List<TestQuestion> list = new ArrayList<>();
        int i = 1;
        list.add(q(i++, "What is the primary purpose of React Hooks?", o("A. To replace Redux completely", "B. To use state and other React features in functional components", "C. To manage routing in a SPA", "D. To optimize CSS rendering"), "B"));
        list.add(q(i++, "Which Hook is used to perform side effects in functional components?", o("A. useState", "B. useEffect", "C. useContext", "D. useMemo"), "B"));
        list.add(q(i++, "What is the 'Virtual DOM' in React?", o("A. A direct copy of the browser DOM", "B. A lightweight JavaScript representation of the real DOM", "C. A database for storing UI state", "D. A new HTML standard"), "B"));
        list.add(q(i++, "In React, how do you pass data from a parent component to a child?", o("A. Using State", "B. Using Props", "C. Using Refs", "D. Using LocalStorage"), "B"));
        list.add(q(i++, "What happens when a component's state changes?", o("A. The page reloads", "B. The component and its children re-render", "C. The browser crashes", "D. Nothing happens until a manual refresh"), "B"));
        list.add(q(i++, "Which Hook is used to access the context value in a functional component?", o("A. useProvider", "B. useContext", "C. useConsumer", "D. useStore"), "B"));
        list.add(q(i++, "What is the purpose of 'keys' in React lists?", o("A. To help React identify which items have changed, been added, or removed", "B. To style individual items", "C. To help React identify which items have changed, been added, or removed", "D. To define the sort order"), "B"));
        list.add(q(i++, "Which Hook would you use to store a persistent value that doesn't trigger a re-render?", o("A. useState", "B. useRef", "C. useMemo", "D. useReducer"), "B"));
        list.add(q(i++, "What is JSX?", o("A. A JavaScript extension that allows writing HTML-like code in JS", "B. A new version of CSS", "C. A backend language for React", "D. A tool for testing React apps"), "A"));
        list.add(q(i++, "Which Hook is used to memoize expensive calculations?", o("A. useCallback", "B. useMemo", "C. useMemoize", "D. useState"), "B"));
        list.add(q(i++, "What is the correct way to update state in React?", o("A. state.value = 10", "B. setState(10)", "C. this.value = 10", "D. update(state, 10)"), "B"));
        list.add(q(i++, "What is a 'Pure Component' in React?", o("A. A component without any CSS", "B. A component that only renders based on props and state and doesn't trigger side effects", "C. A component that cannot have state", "D. A root level component"), "B"));
        list.add(q(i++, "What is 'lifting state up' in React?", o("A. Moving state to a child component", "B. Moving state to the nearest common ancestor to share it between components", "C. Storing state in the cloud", "D. Deleting state when it's not needed"), "B"));
        list.add(q(i++, "What is the purpose of React.Fragment?", o("A. To split a component into smaller files", "B. To group multiple elements without adding an extra node to the DOM", "C. To handle errors in the UI", "D. To improve animation performance"), "B"));
        list.add(q(i++, "Which Hook is used to manage complex state logic with a reducer?", o("A. useComplexState", "B. useReducer", "C. useRedux", "D. useState"), "B"));
        return list;
    }

    // -------------------- PYTHON (15) --------------------
    private static List<TestQuestion> buildPython() {
        List<TestQuestion> list = new ArrayList<>();
        int i = 1;
        list.add(q(i++, "What is the correct way to define a function in Python?", o("A. function myFunc():", "B. def myFunc():", "C. func myFunc():", "D. void myFunc():"), "B"));
        list.add(q(i++, "Which data type is immutable in Python?", o("A. List", "B. Dictionary", "C. Set", "D. Tuple"), "D"));
        list.add(q(i++, "What is the purpose of 'self' in Python classes?", o("A. It refers to the class itself", "B. It refers to the current instance of the class", "C. It is a keyword for private variables", "D. It is used to define static methods"), "B"));
        list.add(q(i++, "How do you create a list in Python?", o("A. [1, 2, 3]", "B. {1, 2, 3}", "C. (1, 2, 3)", "D. <1, 2, 3>"), "A"));
        list.add(q(i++, "What does the 'range()' function return in Python 3?", o("A. A list of numbers", "B. An iterable range object", "C. A generator object", "D. A tuple of numbers"), "B"));
        list.add(q(i++, "Which method is used to add an item to the end of a list?", o("A. push()", "B. append()", "C. add()", "D. insert()"), "B"));
        list.add(q(i++, "What is a 'List Comprehension'?", o("A. A way to compress a list file", "B. A concise way to create lists based on existing iterables", "C. A built-in function to sort lists", "D. A documentation tool for lists"), "B"));
        list.add(q(i++, "How do you handle exceptions in Python?", o("A. try...catch", "B. try...except", "C. do...catch", "D. error...handle"), "B"));
        list.add(q(i++, "What is the output of 3 // 2 in Python 3?", o("A. 1.5", "B. 1", "C. 2", "D. 0"), "B"));
        list.add(q(i++, "Which keyword is used to import a module?", o("A. include", "B. import", "C. require", "D. fetch"), "B"));
        list.add(q(i++, "What is the purpose of the 'with' statement?", o("A. To create a loop", "B. To simplify resource management (like closing files)", "C. To define a context manager", "D. Both B and C"), "D"));
        list.add(q(i++, "What is a 'lambda' function?", o("A. A large, complex function", "B. An anonymous, one-line function", "C. A function used for networking", "D. A recursive function"), "B"));
        list.add(q(i++, "How do you check the length of a string 's'?", o("A. s.length()", "B. len(s)", "C. length(s)", "D. s.len()"), "B"));
        list.add(q(i++, "What does 'pip' stand for in the context of Python?", o("A. Python Interactive Program", "B. Preferred Installer Program (Package Manager)", "C. Python Interface Plugin", "D. Protocol in Python"), "B"));
        list.add(q(i++, "Which operator is used for 'to the power of'?", o("A. ^", "B. **", "C. ^^", "D. pow"), "B"));
        return list;
    }

    private static List<String> o(String a, String b, String c, String d) {
        return List.of(a, b, c, d);
    }
    private static TestQuestion q(int num, String q, List<String> options, String ans) {
        return TestQuestion.builder()
                .questionNumber(num)
                .question(q)
                .options(options)
                .correctAnswer(ans)
                .build();
    }
}
