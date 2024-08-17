﻿namespace Core.DTOs.Track
{
    public class TrackItemDTO
    {
        public int Id { get; set; }
        public string? TrackUrl { get; set; }
        public string? Title { get; set; }
        public string? NormalizedTitle { get; set; }
        public string? Description { get; set; }
        public string? Image { get; set; }
        public string? PerformerUserName { get; set; }
        public string? PublicPerformerNickName { get; set; } 
        public int? GenreId { get; set; }
        public int? CountListened { get; set; }
        public int? Duration { get; set; }
        public bool? IsDeleted { get; set; }
        public bool? IsExplicit { get; set; }
        public DateTime? DateCreated { get; set; }
        public DateTime? DateUpdated { get; set; }
    }
}