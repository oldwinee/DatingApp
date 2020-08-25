using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using API.Data;
using AutoMapper;
using Microsoft.Extensions.Options;
using API.Helpers;
using CloudinaryDotNet;
using System.Threading.Tasks;
using API.DTO;
using System.Security.Claims;
using CloudinaryDotNet.Actions;
using API.Models;
using System.Linq;

namespace API.Controllers
{
    [Route("api/users/{userId}/photos")]
    //[Authorize]
    [ApiController]
    public class PhotosController : ControllerBase
    {
        private readonly IDatingRepository repo;
        private readonly IMapper mapper;
        private readonly IOptions<CloudinarySettings> cloudinaryConfig;
        private Cloudinary cloudinary;

        public PhotosController(IDatingRepository repo, IMapper mapper, IOptions<CloudinarySettings> cloudinaryConfig)
        {
            this.cloudinaryConfig = cloudinaryConfig;
            this.mapper = mapper;
            this.repo = repo;

            Account acc = new Account(
                this.cloudinaryConfig.Value.ClaudName,
                this.cloudinaryConfig.Value.ApiKey,
                this.cloudinaryConfig.Value.ApiSecret
            );

            this.cloudinary = new Cloudinary(acc);
        }

        [HttpGet("{id}", Name = "GetPhoto")]
        public async Task<IActionResult> GetPhoto(int id)
        {
            var photoFromRepo = await this.repo.GetPhoto(id);
            var photo = this.mapper.Map<PhotoForReturnDto>(photoFromRepo);
            return Ok(photo);
        }

        [HttpPost]
        public async Task<IActionResult> AddPhotoForUser(int userId, [FromForm] PhotoForCreationDto photoForCreationDto)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
            {
                return Unauthorized();
            }

            var userFromRepo = await this.repo.GetUser(userId);

            var file = photoForCreationDto.File;
            var uploadResult = new ImageUploadResult();

            if(file.Length > 0){
                using(var stream = file.OpenReadStream()){
                    var uploadParams = new ImageUploadParams(){
                        File = new FileDescription(file.Name, stream),
                        Transformation = new Transformation().Width(500).Height(500).Crop("fill").Gravity("face")
                    };
                    uploadResult = this.cloudinary.Upload(uploadParams);
                }
            }

            photoForCreationDto.Url = uploadResult.Url.ToString();
            photoForCreationDto.PublicId = uploadResult.PublicId;

            var photo = this.mapper.Map<Photo>(photoForCreationDto);

            if(!userFromRepo.Photos.Any(x=>x.IsMain)){
                photo.IsMain = true;
            }

            userFromRepo.Photos.Add(photo);

            if(await this.repo.SaveAll())
            {
                var photoToReturn = this.mapper.Map<PhotoForReturnDto>(photo);
                return CreatedAtRoute("GetPhoto", new {id = photo.Id, userId = photo.UserId}, photoToReturn);
            } 

            return BadRequest("Photo is not saved...!");
        }

        [HttpPost("{id}/setMain")]
        public async Task<IActionResult> SetMainPhoto(int userId, int id)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
            {
                return Unauthorized();
            }

            var user = await this.repo.GetUser(userId);

            if(!user.Photos.Any(x=>x.Id == id))
                return Unauthorized();

            var photoFromRepo = await this.repo.GetPhoto(id);

            if(photoFromRepo.IsMain)
                return BadRequest("This is already the main photo");
            
            var currentMainPhoto = await this.repo.GetCurrentMainPhoto(userId);
            currentMainPhoto.IsMain = false;

            photoFromRepo.IsMain = true;

            if(await this.repo.SaveAll())
                return NoContent();
            
            return BadRequest("Could not set photo to main");
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePhoto(int userId, int id)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
            {
                return Unauthorized();
            }

            var user = await this.repo.GetUser(userId);

            if(!user.Photos.Any(x=>x.Id == id))
                return Unauthorized();

            var photoFromRepo = await this.repo.GetPhoto(id);

            if(photoFromRepo.IsMain)
                return BadRequest("You can not delete your main photo");

            if(photoFromRepo.PublicId != null){
            var deleteParams = new DeletionParams(photoFromRepo.PublicId);
            var result = this.cloudinary.Destroy(deleteParams);
            if( result.Result == "ok" )
                this.repo.Delete(photoFromRepo);
            }
            
            if( photoFromRepo.PublicId == null )
                this.repo.Delete(photoFromRepo);
            
            if(await this.repo.SaveAll())
                return Ok();
            

            return BadRequest("Failed to delete the photo");
        }
    }
}