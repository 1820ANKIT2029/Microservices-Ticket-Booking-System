package com.ankit.user_service.controller;

import com.ankit.user_service.dto.UserRequestDto;
import com.ankit.user_service.dto.UserResponseDto;
import com.ankit.user_service.service.IUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    private final IUserService userService;

    @GetMapping("/{userId}")
    public ResponseEntity<UserResponseDto> getUserById(@PathVariable Long userId){
        UserResponseDto usr = this.userService.getUser(userId);
        return ResponseEntity.ok(usr);
    }

    @PostMapping("")
    public ResponseEntity<UserResponseDto> createUser(@RequestBody UserRequestDto user){
        UserResponseDto usr = this.userService.createUser(user);
        return ResponseEntity.ok(usr);
    }
}
