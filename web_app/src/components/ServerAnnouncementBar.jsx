import { Alert } from '@mui/material';
import { useModule } from '/modules';
import '/style/announcement.scss';

// Map severity to mui alert variant
const MAP_SEVERITY = {
  NORMAL: 'success',
  LOW: 'info',
  MEDIUM: 'warning',
  HIGH: 'error',
};

function ServerAnnouncementBar() {
  // FIXME: useModule() is a custom hook to retrieve module instances. We need to replace this with Redux (garmyhr)
  const { app } = useModule();

  const announcement = app.props?.announcement;

  if (announcement?.visible) {
    return (
      <Alert
        variant='standard'
        severity={MAP_SEVERITY[announcement.severity]}
        className='Announcement'
        onClose={app.props.hideAnnouncement}>
        {announcement.message}
      </Alert>
    );
  }

  return null;
}

export default ServerAnnouncementBar;
