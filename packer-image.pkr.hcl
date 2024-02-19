packer {
  required_plugins {
    googlecompute = {
      source  = "github.com/hashicorp/googlecompute"
      version = ">= 1.1.4"
    }
  }
}    source "googlecompute.centos" "centos-source-image" {
  image_name       = "${var.image_name}-${formatdate("YY-MM-DD-hh-mm-ss", timestamp())}"
  project_id       = var.project_id
  source_image     = var.source_image
  ssh_username     = var.ssh_username
  region           = var.region
  zone             = var.zone
  credentials_file = var.account_file
}

build {
  sources = ["source.googlecompute.centos-source-image"]

  provisioner "shell" {
    inline = [
      "sudo yum update -y",
      "sudo yum install nginx -y",
      "sudo yum install -y unzip",
      "sudo yum clean all"
    ]
  }

  provisioner "shell" {
    script = "setup.sh"
  }
}