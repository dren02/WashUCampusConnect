import axios from 'axios';

export async function fetchDisplayEvents() {
  const userToFetch = localStorage.getItem('username');
  const myPosts = [];
  const savedPosts = [];

  try {
    // Fetch my posts
    const myPostResponse = await axios.get('http://localhost:8000/events');
    const filteredMyPosts = myPostResponse.data
      .filter(event => event.username === userToFetch)
      .map(event => ({
        id: event.id,
        title: event.name,
        start: `${event.date}T${event.time}`,
        color: '#2c3e50'
      }));
    myPosts.push(...filteredMyPosts);

    // Fetch saved posts
    const savedPostResponse = await axios.get('http://localhost:8000/auth');
    const userSavedPosts = savedPostResponse.data.find(
      user => user.username === userToFetch
    );

    if (userSavedPosts && userSavedPosts.savedEvents.length > 0) {
      const savedEventIds = userSavedPosts.savedEvents;
      const ids = savedEventIds.join(',');
      const response = await axios.get(`http://localhost:8000/events/?ids=${ids}`);
      const filteredSavedPosts = response.data.map(event => ({
        id: event.id,
        title: event.name,
        start: `${event.date}T${event.time}`,
        color: '#BA0C2F'
      }));
      savedPosts.push(...filteredSavedPosts);
    }
  } catch (err) {
    console.error('Failed to fetch events:', err);
  }

  return { myPosts, savedPosts };
}
