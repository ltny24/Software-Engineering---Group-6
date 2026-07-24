package com.myus.infrastructure.security;

import com.myus.domain.model.Administrator;
import com.myus.domain.model.Student;
import com.myus.domain.repository.AdministratorRepository;
import com.myus.domain.repository.StudentRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    private final StudentRepository studentRepository;
    private final AdministratorRepository administratorRepository;

    public UserDetailsServiceImpl(StudentRepository studentRepository, AdministratorRepository administratorRepository) {
        this.studentRepository = studentRepository;
        this.administratorRepository = administratorRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Optional<Student> studentOpt = studentRepository.findByUsername(username);
        if (studentOpt.isPresent()) {
            return studentOpt.get();
        }

        Optional<Administrator> adminOpt = administratorRepository.findByUsername(username);
        if (adminOpt.isPresent()) {
            return adminOpt.get();
        }

        throw new UsernameNotFoundException("User not found with username: " + username);
    }
}
