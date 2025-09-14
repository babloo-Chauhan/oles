package com.oles.oles.dto;
import jakarta.validation.constraints.*;
public record AuthRequest(@NotBlank String username, @NotBlank String password) {}
