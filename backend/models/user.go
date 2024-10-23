package models

import (
	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	Name     string `json:"name"`
	Email    string `json:"email" gorm:"unique"`
	Password string `json:"-"`    // Don't expose the password in the JSON response
	Role     string `json:"role"` // "User", "BusinessOwner", "Admin"
}
