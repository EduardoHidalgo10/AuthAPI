using AuthAPI.Constants;
using AuthAPI.Models.Dtos;
using AuthAPI.Repository.IRepository;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AuthAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly IUserRepository _userRepository;

        public UsersController(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        [HttpGet]
        [Authorize(Roles = Roles.Admin)]
        public IActionResult GetUsers()
        {
            var users = _userRepository.GetAllUsers();
            var usersDto = users.Select(user => new UserRegisterDto
            {
                Id = user.UserId.ToString(),
                UserName = user.Email,
                Name = user.Name,
                Role = user.Role
            }).ToList();

            return Ok(usersDto);
        }

        [HttpGet("{id:int}")]
        [Authorize]
        public IActionResult GetUser(int id)
        {
            var user = _userRepository.GetUser(id);
            if (user is null)
            {
                return NotFound();
            }

            var userDto = new UserRegisterDto
            {
                Id = user.UserId.ToString(),
                UserName = user.Email,
                Name = user.Name,
                Role = user.Role
            };

            return Ok(userDto);
        }

        [HttpPost("register")]
        [AllowAnonymous]
        public async Task<IActionResult> Register([FromBody] UserSignUpDto signupUserDto)
        {
            if (signupUserDto is null)
            {
                return BadRequest(new { message = "Signup data is required." });
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (!_userRepository.IsUniqueUser(signupUserDto.Email))
            {
                return BadRequest(new { message = "Email is already registered." });
            }

            var registeredUser = await _userRepository.Register(signupUserDto);
            if (registeredUser is null)
            {
                return BadRequest(new { message = "Registration failed." });
            }

            return Ok(registeredUser);
        }

        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<IActionResult> Login([FromBody] UserLoginDto userLoginDto)
        {
            if (userLoginDto is null)
            {
                return BadRequest(new { message = "Login data is required." });
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var loginResponse = await _userRepository.Login(userLoginDto);
            if (loginResponse.User is null || string.IsNullOrEmpty(loginResponse.Token))
            {
                return Unauthorized(new { message = loginResponse.Message });
            }

            return Ok(loginResponse);
        }
    }
}
