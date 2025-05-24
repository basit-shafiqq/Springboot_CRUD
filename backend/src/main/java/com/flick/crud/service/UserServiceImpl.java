package com.flick.crud.service;

import com.flick.crud.model.User;
import com.flick.crud.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@AllArgsConstructor
public class UserServiceImpl implements UserService {

    private UserRepository repository;

    @Override
    public User createUser(User user) {
        return repository.save(user);
    }

    @Override
    public User getUserById(Long id) {
        return repository.findById(id).orElseThrow(()->new RuntimeException("User doest not exits!"));
    }

    @Override
    public List<User> getAllUsers() {
        List<User> userList = new ArrayList<>();
        userList = repository.findAll();
        return userList;
    }

    @Override
    public User updateUser(Long id, User user) {

        User current = getUserById(id);
        current.setName(user.getName());
        current.setEmail(user.getEmail());
        current.setPassword(user.getPassword());
        return repository.save(current);
    }

    @Override
    public void deleteUser(Long id) {

        repository.deleteById(id);
    }
}
