using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Models;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class DatingRepository : IDatingRepository
    {
        private readonly DataContext context;
        public DatingRepository(DataContext context)
        {
            this.context = context;
        }
        public void Add<T>(T entity) where T : class
        {
            this.context.Add(entity);
        }

        public void Delete<T>(T entity) where T : class
        {
            this.context.Remove(entity);
        }

        public async Task<Photo> GetCurrentMainPhoto(int userId)
        {
            return await this.context.Photos.Where(x=>x.UserId==userId).FirstOrDefaultAsync(x=>x.IsMain==true);
        }

        public async Task<Photo> GetPhoto(int id)
        {
            var photo =  await this.context.Photos.FirstOrDefaultAsync(x=>x.Id == id);
            return photo;
        }

        public async Task<User> GetUser(int id)
        {
            return await this.context.Users.Include(p=>p.Photos).FirstOrDefaultAsync( x => x.Id == id);
        }

        public async  Task<IEnumerable<User>> GetUsers()
        {
            return await this.context.Users.Include(p=>p.Photos).ToListAsync();    
        }

        public async Task<bool> SaveAll()
        {
            return await this.context.SaveChangesAsync() > 0;
        }
    }
}