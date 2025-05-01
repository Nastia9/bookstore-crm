using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace BookStore.Identity.Services
{
    public class TokenService : ITokenService
    {
        private readonly SymmetricSecurityKey _key;
        private readonly string _issuer;
        private readonly string _audience;
        private readonly int _expiresInMonths;

        public TokenService(IConfiguration config)
        {
            var section = config.GetSection("Jwt");
            _issuer = section["Issuer"]!;
            _audience = section["Audience"]!;
            _expiresInMonths = int.Parse(section["ExpiresInMonths"]!);

            var keyBase64 = section["Key"]!;
            var keyBytes = Convert.FromBase64String(keyBase64!);
            _key = new SymmetricSecurityKey(keyBytes);
        }

        public string CreateToken(string userId, string email, IEnumerable<string> roles)
        {
            var now = DateTime.UtcNow;
            var creds = new SigningCredentials(_key, SecurityAlgorithms.HmacSha256);

            var claims = new List<Claim> {
            new Claim(JwtRegisteredClaimNames.Sub, userId),
            new Claim(JwtRegisteredClaimNames.Email, email),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };
            claims.AddRange(roles.Select(r => new Claim(ClaimTypes.Role, r)));

            var token = new JwtSecurityToken(
                issuer: _issuer,
                audience: _audience,
                claims: claims,
                notBefore: now,
                expires: now.AddMonths(_expiresInMonths),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
