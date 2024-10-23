package models

import (
	"gorm.io/gorm" // Using GORM for ORM (Go Object-Relational Mapping)
)

type Restaurant struct {
	gorm.Model
	Name       string  `json:"name"`
	Address    string  `json:"address"`
	Category   string  `json:"category"`
	PriceRange string  `json:"price_range"`
	Rating     float64 `json:"rating"`
	OwnerID    uint    `json:"owner_id"` // Business Owner who owns the restaurant
}
