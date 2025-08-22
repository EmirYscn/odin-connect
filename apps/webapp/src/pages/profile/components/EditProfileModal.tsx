import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';

import TextareaAutosize from 'react-textarea-autosize';
import ProfileBackgroundImage from './ProfileBackgroundImage';
import { useUser } from '../../../hooks/useUser';
import { useProfile } from '../../../hooks/useProfile';
import { useEditProfile } from '../../../hooks/useEditProfile';
import Button from '../../../components/Button';
import ProfileImage from '../../../components/ProfileImage';
import FormRowVertical from '../../../components/FormRowVertical';
import Input from '../../../components/Input';

type EditProfileModalProps = {
  onConfirm?: () => void;
  disabled?: boolean;
  onCloseModal?: (e?: React.MouseEvent) => void;
};

type EditProfileFormData = {
  displayName: string;
  username: string;
  bio: string;
  website: string;
  location: string;
};

function EditProfileModal({ onCloseModal }: EditProfileModalProps) {
  const { user } = useUser();
  const { profile } = useProfile(user?.username as string);
  const { editProfile, isPending } = useEditProfile();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EditProfileFormData>({
    defaultValues: {
      displayName: '',
      username: '',
      bio: '',
      website: '',
      location: '',
    },
  });
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);

  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [backgroundImageFile, setBackgroundImageFile] = useState<File | null>(
    null
  );

  useEffect(() => {
    return () => {
      if (profileImage?.startsWith('blob:')) {
        URL.revokeObjectURL(profileImage);
      }
    };
  }, [profileImage]);

  useEffect(() => {
    return () => {
      if (backgroundImage?.startsWith('blob:')) {
        URL.revokeObjectURL(backgroundImage);
      }
    };
  }, [backgroundImage]);

  function handleProfileImageSelection(file: File) {
    const previewUrl = URL.createObjectURL(file);
    setProfileImage(previewUrl);
    setProfileImageFile(file); // Save file for uploading later
  }

  function handleBackgroundImageSelection(file: File) {
    const previewUrl = URL.createObjectURL(file);
    setBackgroundImage(previewUrl);
    setBackgroundImageFile(file); // Save file for uploading later
  }

  // Store initial values in a ref
  const initialValues = useRef<EditProfileFormData | null>(null);
  // Update form values when profile data is loaded
  useEffect(() => {
    if (profile) {
      const values = {
        displayName: profile.user.displayName || '',
        username: profile.user.username || '',
        bio: profile.bio || '',
        website: profile.website || '',
        location: profile.location || '',
      };
      reset(values);
      initialValues.current = values;
    }
  }, [profile, reset]);

  const onSubmit = (data: EditProfileFormData) => {
    if (!initialValues.current) return;
    // Build object with only changed fields
    const changedFields = (
      Object.keys(data) as (keyof EditProfileFormData)[]
    ).reduce((acc, key) => {
      if (data[key] !== initialValues.current![key]) {
        acc[key] = data[key];
      }
      return acc;
    }, {} as Partial<EditProfileFormData>);

    // If no fields changed, prevent submission
    if (
      Object.keys(changedFields).length === 0 &&
      !profileImageFile &&
      !backgroundImageFile
    ) {
      return;
    }

    const changedFieldsWithImageFiles = {
      ...changedFields,
      profileImageFile: profileImageFile || undefined, // Include imageFile only if it exists
      backgroundImageFile: backgroundImageFile || undefined, // Include backgroundImageFile only if it exists
    };

    // Submit only changed fields
    editProfile(changedFieldsWithImageFiles, {
      onSuccess: () => {
        onCloseModal?.();
      },
    });
  };

  return (
    <div className="p-4 w-[20rem] md:w-[30rem] lg:w-[40rem] ">
      <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="mb-4 text-xl font-semibold">Edit Profile</h2>
          <Button type="submit" variation="save" disabled={isPending}>
            Save
          </Button>
        </div>

        <div className="overflow-y-auto max-h-130">
          <div className="relative">
            <ProfileBackgroundImage
              context="edit"
              imgSrc={backgroundImage || profile?.user.backgroundImage}
              setBackgroundImageFromFile={handleBackgroundImageSelection}
            />
            <div className="absolute left-4 -bottom-12">
              <ProfileImage
                context="edit"
                imgSrc={profileImage || profile?.user.avatar}
                setProfileImageFromFile={handleProfileImageSelection}
              />
            </div>
          </div>
          <div className="h-12" />
          <FormRowVertical
            label="Display Name"
            formError={errors?.displayName?.message}
          >
            <Input placeholder="Display Name" {...register('displayName')} />
          </FormRowVertical>
          <FormRowVertical
            label="Username"
            formError={errors?.username?.message}
          >
            <Input placeholder="Username" {...register('username')} />
          </FormRowVertical>
          <FormRowVertical label="Bio" formError={errors?.bio?.message}>
            <TextareaAutosize
              className="w-full p-3 resize-none rounded-lg focus:outline-none bg-[var(--color-grey-0)]/30 shadow-sm"
              minRows={1}
              maxRows={3}
              placeholder="Tell us about yourself"
              {...register('bio')}
            />
          </FormRowVertical>
          <FormRowVertical label="Website" formError={errors?.website?.message}>
            <Input placeholder="https://example.com" {...register('website')} />
          </FormRowVertical>
          <FormRowVertical
            label="Location"
            formError={errors?.location?.message}
          >
            <Input placeholder="Your Location" {...register('location')} />
          </FormRowVertical>
        </div>
      </form>
    </div>
  );
}

export default EditProfileModal;
