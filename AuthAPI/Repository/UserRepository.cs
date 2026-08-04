using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using AuthAPI.Constants;
using AuthAPI.Data;
using AuthAPI.Models;
using AuthAPI.Models.Dtos;
using AuthAPI.Repository.IRepository;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;

namespace AuthAPI.Repository
{
    public class UserRepository : IUserRepository
    {
        private readonly ApplicationDbContext _db;
        private readonly string _secretKey;
        private readonly PasswordHasher<User> _passwordHasher = new();

        public UserRepository(ApplicationDbContext db, IConfiguration configuration)
        {
            _db = db;
            _secretKey = configuration.GetValue<string>("ApiSettings:Secret")
                ?? throw new InvalidOperationException("ApiSettings:Secret is not configured.");
        }

        public ICollection<User> GetAllUsers()
        {
            return _db.Users.OrderBy(u => u.Name).ToList();
        }

        public User? GetUser(int id)
        {
            return _db.Users.FirstOrDefault(u => u.UserId == id);
        }

        public bool IsUniqueUser(string email)
        {
            var normalizedEmail = email.ToLower().Trim();
            return !_db.Users.Any(u => u.Email.ToLower().Trim() == normalizedEmail);
        }

        public Task<UserLoginResponseDto> Login(UserLoginDto userLoginDto)
        {
            var normalizedEmail = userLoginDto.Email.ToLower().Trim();
            var user = _db.Users.FirstOrDefault(u => u.Email.ToLower().Trim() == normalizedEmail);

            var invalidResponse = new UserLoginResponseDto
            {
                User = null,
                Token = string.Empty,
                Message = "Invalid email or password."
            };

            if (user is null)
            {
                return Task.FromResult(invalidResponse);
            }

            var verificationResult = _passwordHasher.VerifyHashedPassword(user, user.PasswordHash, userLoginDto.Password);
            if (verificationResult == PasswordVerificationResult.Failed)
            {
                return Task.FromResult(invalidResponse);
            }

            var token = CreateJwtToken(user);

            return Task.FromResult(new UserLoginResponseDto
            {
                User = new UserRegisterDto
                {
                    Id = user.UserId.ToString(),
                    UserName = user.Email,
                    Name = user.Name,
                    Role = user.Role
                },
                Token = token,
                Message = "Login successful."
            });
        }

        public async Task<UserRegisterDto?> Register(UserSignUpDto signupUserDto)
        {
            var user = new User
            {
                Name = signupUserDto.Name.Trim(),
                Email = signupUserDto.Email.ToLower().Trim(),
                Role = Roles.User
            };

            user.PasswordHash = _passwordHasher.HashPassword(user, signupUserDto.Password);

            _db.Users.Add(user);
            await _db.SaveChangesAsync();

            return new UserRegisterDto
            {
                Id = user.UserId.ToString(),
                UserName = user.Email,
                Name = user.Name,
                Role = user.Role
            };
        }

        public async Task<UserRegisterDto?> UpdateRole(int userId, string role)
        {
            var user = _db.Users.FirstOrDefault(u => u.UserId == userId);
            if (user is null)
            {
                return null;
            }

            user.Role = role;
            await _db.SaveChangesAsync();

            return new UserRegisterDto
            {
                Id = user.UserId.ToString(),
                UserName = user.Email,
                Name = user.Name,
                Role = user.Role
            };
        }

        private string CreateJwtToken(User user)
        {
            var key = Encoding.ASCII.GetBytes(_secretKey);
            var tokenHandler = new JwtSecurityTokenHandler();

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(
                [
                    new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()),
                    new Claim(ClaimTypes.Email, user.Email),
                    new Claim(ClaimTypes.Name, user.Name),
                    new Claim(ClaimTypes.Role, user.Role)
                ]),
                Expires = DateTime.UtcNow.AddDays(7),
                SigningCredentials = new SigningCredentials(
                    new SymmetricSecurityKey(key),
                    SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }
}
