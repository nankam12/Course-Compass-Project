package com.coursecompass.service;

import com.coursecompass.model.User;
import com.coursecompass.repository.UserRepository;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserRepository userRepository;

    public UserDetailsServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /** Used by Spring Security form-based login — not used in JWT flow but required by interface. */
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));
        return buildUserDetails(user);
    }

    /** Used by JwtAuthFilter to load user by ID from JWT subject claim. */
    public UserDetails loadUserById(String id) {
        User user = userRepository.findById(id).orElse(null);
        if (user == null) return null;
        return buildUserDetails(user);
    }

    private UserDetails buildUserDetails(User user) {
        String role = user.getRole() != null ? user.getRole().toUpperCase() : "STUDENT";
        return new org.springframework.security.core.userdetails.User(
                user.getId(),
                user.getPassword() != null ? user.getPassword() : "",
                List.of(new SimpleGrantedAuthority("ROLE_" + role))
        );
    }
}
