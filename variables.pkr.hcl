variable "account_file" {
  type    = string
  default = "account-gcp.json"
}

variable "project_id" {
  type    = string
  default = "dev-gcp-414704"
}

variable "source_image" {
  type    = string
  default = "centos-stream-8-v20240110"
}

variable "ssh_username" {
  type    = string
  default = "packer"
}

variable "image_description" {
  type    = string
  default = "Custom image for webapp"
}

variable "zone" {
  type    = string
  default = "us-east1-b"
}

variable "region" {
  type    = string
  default = "us-east1"
}

variable "image_name" {
  type    = string
  default = "webapp-packer-image"
}
