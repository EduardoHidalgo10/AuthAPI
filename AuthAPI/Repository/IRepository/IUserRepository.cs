using AuthAPI.Models;
using AuthAPI.Models.Dtos;

namespace AuthAPI.Repository.IRepository
{
    public interface IUserRepository
    {
        ICollection<User> GetAllUsers();

        User? GetUser(int id);

        bool IsUniqueUser(string email);

        Task<UserLoginResponseDto> Login(UserLoginDto userLoginDto);

        Task<UserRegisterDto?> Register(UserSignUpDto signupUserDto);
    }
}
