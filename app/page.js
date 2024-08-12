'use client'
import { Box, Stack, Typography, Button, Modal, TextField } from '@mui/material'
import { firestore } from '@/firebase'
import { collection, query, getDocs, doc, setDoc, deleteDoc, getDoc } from 'firebase/firestore'
import { useEffect, useState } from 'react'

// Learn to add and remove products 
const item = ['Tomato', 'Potato', 'Onion', 'Carrot', 'Broccoli', 'Cucumber', 'Spinach', 'Garlic', 'Pepper', 'Lettuce', 'Eggplant', 'Zucchini', 'Cauliflower', 'Kale', 'Bell Pepper'];

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'white',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};



export default function Home() {
  const [pantryList, setPantry] = useState([])
  const [filteredPantryList, setFilteredPantryList] = useState([]) // State for filtered list
  const [quantity, setQuantity] = useState(1)
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [searchQuery, setSearchQuery] = useState('')

  const [itemName, setItemName] = useState('')

  const updatePantry = async () => {
    const snapshot = query(collection(firestore, 'pantryTrack'))
    const docs = await getDocs(snapshot)
    const pantryList = []
    docs.forEach((doc) => {
      const data = doc.data();
      pantryList.push({ name: doc.id, quantity: typeof data.quantity === 'number' ? data.quantity : 0 })
    })
    setPantry(pantryList)
    setFilteredPantryList(pantryList) // Set initial filtered list
  }

  useEffect(() => {
    updatePantry()
  }, [])

  const addItem = async (item, quantity) => {
    const docRef = doc(collection(firestore, 'pantryTrack'), item)
    const docSnapshot = await getDoc(docRef)
    if (docSnapshot.exists()) {
      const existingQuantity = docSnapshot.data().quantity || 0
      await setDoc(docRef, { quantity: existingQuantity + quantity })
    } else {
      await setDoc(docRef, { quantity })
    }
    updatePantry()
  }

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'pantryTrack'), item)
    await deleteDoc(docRef)
    updatePantry()
  }

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredPantryList(pantryList); // Show all items if search query is empty
    } else {
      const filteredList = pantryList.filter(item =>
        item.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredPantryList(filteredList);
    }
  }

  return (
    <Box width="100vw" height="100vh" display={'flex'} justifyContent={'center'} flexDirection={'column'} alignItems={'center'} gap={2}>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Add An Item
          </Typography>
          <Stack width="100%" height="50px" direction={'row'} spacing={2}>
            <TextField id="outlined-basic" label="Item" variant="outlined" fullWidth value={itemName} onChange={(e) => setItemName(e.target.value)} />
            <TextField id="outlined-quantity" label="Quantity" type='number' variant="outlined" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} inputProps={{ min: 1 }} />
            <Button
              variant="outlined"
              onClick={() => {
                addItem(itemName, quantity)
                setItemName('')
                setQuantity(1)
                handleClose()
              }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>

      <Button variant="contained" onClick={handleOpen}>Add Items</Button>

      <TextField
        id="search-bar"
        label="Search Items"
        variant="outlined"
        value={searchQuery}
        onChange={(e) => handleSearch(e.target.value)}
        sx={{ marginBottom: 2 }}
      />

      <Box border={'1px solid #333'}>
        <Box width="800px" height="100px" bgcolor={'#f0f0f0'}>
          <Typography variant={'h2'} color={'#333'} textAlign={'center'}>
            Pantry Items
          </Typography>
        </Box>
        <Stack width="800px" height="300px" spacing={2} overflow={'auto'}>
          {
            filteredPantryList.map((i) => (
              <Stack key={i.name} direction={'row'} spacing={2} justifyContent={'center'} alignContent={'space-between'}>
                <Box key={i.name} width="100%" height="100px" display={'flex'} justifyContent={'center'} bgcolor={'#add8e7'}>
                  <Typography variant={'h2'} color={'#333'} textAlign={'center'}>
                    {`${i.name.charAt(0).toUpperCase() + i.name.slice(1)} : ${i.quantity}`}
                  </Typography>
                </Box>
                <Button
                  variant="contained"
                  onClick={() => removeItem(i.name)}
                  sx={{
                    padding: '4px 8px',
                    fontSize: '0.8rem',
                    minWidth: 'auto',
                    height: 'fit-content',
                    alignSelf: 'center'
                  }}
                >
                  Remove
                </Button>
              </Stack>
            ))
          }
        </Stack>
      </Box>
    </Box>
  )
}
