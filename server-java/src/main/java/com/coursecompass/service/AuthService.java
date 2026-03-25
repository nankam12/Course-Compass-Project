package com.coursecompass.service;

import com.coursecompass.dto.AuthResponse;
import com.coursecompass.dto.LoginRequest;
import com.coursecompass.dto.RegisterRequest;
import com.coursecompass.model.User;
import com.coursecompass.repository.UserRepository;
import com.coursecompass.security.JwtUtils;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtUtils jwtUtils) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtils = jwtUtils;
    }

    public AuthResponse register(RegisterRequest req) {
        String normalizedEmail = req.getEmail().toLowerCase().trim();

        if (userRepository.existsByEmailIgnoreCase(normalizedEmail)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "An account with this email already exists");
        }
        if (userRepository.existsByUsername(req.getUsername())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "An account with this username already exists");
        }

        User user = new User();
        user.setUsername(req.getUsername());
        user.setEmail(normalizedEmail);
        user.setPassword(passwordEncoder.encode(req.getPassword()));
        user = userRepository.save(user);

        return buildAuthResponse(jwtUtils.generateToken(user.getId()), user);
    }

    public AuthResponse login(LoginRequest req) {
        String normalizedEmail = req.getEmail().toLowerCase().trim();

        User user = userRepository.findByEmailIgnoreCase(normalizedEmail)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED,
                        "Invalid email or password"));

        if (!passwordEncoder.matches(req.getPassword(), user.getPassword())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED,
                    "Invalid email or password");
        }

        return buildAuthResponse(jwtUtils.generateToken(user.getId()), user);
    }

    private AuthResponse buildAuthResponse(String token, User user) {
        AuthResponse.UserDto userDto = new AuthResponse.UserDto(
                user.getId(), user.getUsername(), user.getEmail(), user.getRole());
        return new AuthResponse(token, userDto);
    }
}
