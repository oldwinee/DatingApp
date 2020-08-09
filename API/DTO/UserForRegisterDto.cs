using System.ComponentModel.DataAnnotations;

namespace API.DTO
{
    public class UserRegisterDto
    {
        [Required]
        public string Username { get; set; }    

        [Required]
        [StringLength(8, MinimumLength = 4, ErrorMessage="You must specify password between 4 to 8")]
        public string Password { get; set; }
    }
}