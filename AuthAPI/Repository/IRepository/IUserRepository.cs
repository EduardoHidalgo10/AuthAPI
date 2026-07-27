using AuthAPI.Models;
using AuthAPI.Models.Dtos;

namespace AuthAPI.Repository.IRepository
{
    public interface IUserRepository
    {
        ICollection<User> GetAllUsers();

        User? GetUser(int id);

        bool IsUniqueUser(string name);

        Task<UserLoginResponseDto> Login(UserLoginDto userLoginDto);

        Task<User> Register(UserSignUpDto signupUserDto);
    }
}
