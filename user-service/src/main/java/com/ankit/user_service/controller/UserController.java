package com.ankit.user_service.controller;

import com.ankit.user_service.dto.ApiResponse;
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

    @GetMapping("")
    public ResponseEntity<ApiResponse<UserResponseDto>> getUser(
            @RequestHeader("X-User-Id") String userId
    ){
        UserResponseDto usr = this.userService.getUser(userId);
        return ResponseEntity.ok(new ApiResponse<>(usr, "user details"));
    }

    @GetMapping("/{userId}")
    public ResponseEntity<ApiResponse<UserResponseDto>> getUserById(@PathVariable String userId){
        UserResponseDto usr = this.userService.getUser(userId);
        return ResponseEntity.ok(new ApiResponse<>(usr, "user details"));
    }
}
