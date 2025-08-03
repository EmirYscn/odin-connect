import Button from '../../../components/Button';
import Modal from '../../../components/Modal';
import EditProfileModal from './EditProfileModal';

function EditProfile() {
  return (
    <div className="ml-auto px-2">
      <Modal>
        <Modal.Open opens="editProfile">
          <Button variation="editProfile">Edit Profile</Button>
        </Modal.Open>
        <Modal.Window
          name="editProfile"
          className="text-[var(--color-grey-800)]"
        >
          <EditProfileModal />
        </Modal.Window>
      </Modal>
    </div>
  );
}

export default EditProfile;
