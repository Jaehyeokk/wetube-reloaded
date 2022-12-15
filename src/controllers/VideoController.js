export const trending = (req, res) => res.send('Home Page Videos');
export const search = (req, res) => res.send('Search');
export const see = (req, res) => {
  res.send(`See Video #ID: ${req.params.id}`);
}
export const edit = (req, res) => res.send('Edit Video');
export const upload = (req, res) => res.send('Upload Video');
export const remove = (req, res) => res.send('remove Video');