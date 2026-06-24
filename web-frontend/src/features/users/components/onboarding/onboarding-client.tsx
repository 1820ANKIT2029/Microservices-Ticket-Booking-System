"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { MapPin, Camera, Loader2, Check, User, ArrowRight, Mail, Phone } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Footer } from "@/shared/components/layout/footer";
import { AuthService } from "@/features/auth";
import { JwtUtils } from "@/shared/utils";

const AVAILABLE_INTERESTS = [
  "Action Movies",
  "Live Cricket",
  "Rock Concerts",
  "Stand-up Comedy",
  "Tech Summits",
  "Art Exhibitions",
  "Food Festivals"
];

export function OnboardingClient() {
  const router = useRouter();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const [fullName, setFullName] = React.useState("");
  const [location, setLocation] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phoneNumber, setPhoneNumber] = React.useState("");
  const [selectedInterests, setSelectedInterests] = React.useState<string[]>([]);
  const [avatarUrl, setAvatarUrl] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      router.push("/auth/signin");
    }
  }, [router]);

  const handleToggleInterest = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setError("Image size should be less than 2MB.");
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setAvatarUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!fullName.trim()) {
      setError("Full name is required.");
      return;
    }
    if (!location.trim()) {
      setError("Location is required.");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setError("A valid email address is required.");
      return;
    }
    if (!phoneNumber.trim()) {
      setError("Phone number is required.");
      return;
    }
    if (selectedInterests.length < 3) {
      setError(`Please select at least 3 interests (currently selected: ${selectedInterests.length}).`);
      return;
    }

    setIsLoading(true);

    try {
      const nameParts = fullName.trim().split(/\s+/);
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";

      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      if (token) {
        const userId = token ? JwtUtils.getUserIdFromToken(token) : null;
        if (userId) {
          await AuthService.createProfile({
            firstName,
            lastName,
            email: email.trim(),
            phoneNumber: phoneNumber.trim(),
            avatarUrl: avatarUrl || "",
          });
        }
      }

      // Save data locally to simulate user state updates
      const profileData = {
        fullName: fullName.trim(),
        location: location.trim(),
        email: email.trim(),
        phoneNumber: phoneNumber.trim(),
        interests: selectedInterests,
        avatarUrl,
        onboarded: true
      };
      localStorage.setItem("eventpass_profile", JSON.stringify(profileData));

      router.push("/bookings");
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to save profile. Please try again.";
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    router.push("/bookings");
  };

  return (
    <div className="min-h-screen bg-background text-on-background flex flex-col font-sans">
      <main className="flex-grow pt-24 pb-16 px-4 md:px-16 flex justify-center items-start">
        <div className="w-full max-w-[600px] mt-2 md:mt-8">
          <div className="text-center mb-10">
            <h1 className="text-2xl md:text-3xl font-bold text-on-surface mb-3 tracking-tight">
              Welcome to EventPass! Let&apos;s set up your profile.
            </h1>
            <p className="text-body-md text-secondary max-w-md mx-auto">
              Personalize your experience to discover the best events happening near you.
            </p>
          </div>

          <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-xl p-6 md:p-8 shadow-lg shadow-black/[0.03]">
            {error && (
              <div
                className="mb-6 p-4 bg-error-container text-on-error-container rounded-lg text-sm font-semibold border border-error/20 animate-in fade-in slide-in-from-top-2 duration-200"
                role="alert"
              >
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="flex flex-col items-center gap-3">
                <div className="relative group">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-32 h-32 rounded-full bg-surface-container-high border-2 border-dashed border-outline/70 flex items-center justify-center overflow-hidden cursor-pointer hover:border-primary hover:bg-surface-container transition-all group-focus-visible:ring-2 group-focus-visible:ring-primary focus:outline-none"
                    aria-label="Upload profile photo"
                  >
                    {avatarUrl ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        alt="Profile preview"
                        className="w-full h-full object-cover"
                        src={avatarUrl}
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-outline group-hover:text-primary transition-colors">
                        <Camera className="size-8 mb-1" />
                        <span className="text-xs font-semibold">Add Photo</span>
                      </div>
                    )}
                  </button>
                  <input
                    ref={fileInputRef}
                    accept="image/*"
                    className="hidden"
                    type="file"
                    onChange={handleFileChange}
                  />
                </div>
                <span className="text-xs font-semibold text-secondary">Profile Photo</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-on-surface-variant block ml-1" htmlFor="fullName">
                    Full Name
                  </label>
                  <div className="relative group">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors flex items-center" aria-hidden="true">
                      <User className="size-5" />
                    </span>
                    <input
                      className="w-full pl-12 pr-4 py-3 bg-surface border border-outline-variant/85 rounded-lg text-body-md focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all placeholder:text-outline/65 text-on-surface"
                      id="fullName"
                      placeholder="e.g. Alex Rivera"
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      disabled={isLoading}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-on-surface-variant block ml-1" htmlFor="location">
                    Location
                  </label>
                  <div className="relative group">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors flex items-center" aria-hidden="true">
                      <MapPin className="size-5" />
                    </span>
                    <input
                      className="w-full pl-12 pr-4 py-3 bg-surface border border-outline-variant/85 rounded-lg text-body-md focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all placeholder:text-outline/65 text-on-surface"
                      id="location"
                      placeholder="City, Country"
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      disabled={isLoading}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-on-surface-variant block ml-1" htmlFor="email">
                    Email Address
                  </label>
                  <div className="relative group">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors flex items-center" aria-hidden="true">
                      <Mail className="size-5" />
                    </span>
                    <input
                      className="w-full pl-12 pr-4 py-3 bg-surface border border-outline-variant/85 rounded-lg text-body-md focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all placeholder:text-outline/65 text-on-surface"
                      id="email"
                      placeholder="alex.rivera@example.com"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isLoading}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-on-surface-variant block ml-1" htmlFor="phoneNumber">
                    Phone Number
                  </label>
                  <div className="relative group">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors flex items-center" aria-hidden="true">
                      <Phone className="size-5" />
                    </span>
                    <input
                      className="w-full pl-12 pr-4 py-3 bg-surface border border-outline-variant/85 rounded-lg text-body-md focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all placeholder:text-outline/65 text-on-surface"
                      id="phoneNumber"
                      placeholder="+1 (555) 000-0000"
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      disabled={isLoading}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-end px-1">
                  <h3 className="text-sm font-bold text-on-surface">Pick your interests</h3>
                  <span className="text-xs font-semibold text-secondary">
                    Select at least 3 ({selectedInterests.length} selected)
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {AVAILABLE_INTERESTS.map((interest) => {
                    const isSelected = selectedInterests.includes(interest);
                    return (
                      <button
                        key={interest}
                        type="button"
                        onClick={() => handleToggleInterest(interest)}
                        className={`interest-chip flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold border transition-all duration-200 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer select-none ${isSelected
                            ? "bg-primary text-white border-primary shadow-sm"
                            : "bg-surface-container-low text-on-secondary-container hover:border-primary/50 border-transparent"
                          }`}
                        aria-pressed={isSelected}
                      >
                        {isSelected && <Check className="size-3" />}
                        {interest}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4 space-y-4">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-6 bg-primary-container text-on-primary text-sm font-bold rounded-lg shadow-md hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer border-none"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Saving Preferences...
                    </>
                  ) : (
                    <>
                      Complete Profile
                      <ArrowRight className="size-4" />
                    </>
                  )}
                </Button>
                <div className="text-center">
                  <button
                    type="button"
                    onClick={handleSkip}
                    disabled={isLoading}
                    className="text-secondary hover:text-primary font-semibold text-sm transition-colors cursor-pointer"
                  >
                    Skip for Now
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
