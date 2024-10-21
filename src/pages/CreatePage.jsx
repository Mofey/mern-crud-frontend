import {useState} from 'react'
import {Box, Button, Container, Heading, Input, useColorModeValue, useToast, VStack} from '@chakra-ui/react'
import { useProductStore } from '../store/product'

const CreatePage = () => {

  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    image: ''
  })

  const toast = useToast();

  const { createProduct } = useProductStore();

  const handleAddProduct = async () => {
    //console.log('New product: ', newProduct);

    const { success, message } = await createProduct(newProduct);
    if(!success) {
      toast({
        title: 'Error',
        description: message,
        status: 'error',
        isClosable: true
      });
    } else {
      toast({
        title: 'Success',
        description: message,
        status: 'success',
        isClosable: true
      });
    }
  }


  return (
    <Container maxW={'container.sm'}>
      <VStack
      spacing={8}
      >
        <Heading as={'h1'} size={'2xl'} textAlign={'center'} mb={8}>
          Create a new product
        </Heading>

        <Box w={'full'}
        bg={useColorModeValue('white', 'gray.800')}
        p={6} rounded={'lg'} shadow={'md'}
        >
          <VStack spacing={4}>
            <Input
              placeholder={'Product name'}
              value={newProduct.name}
              onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
            />
            <Input
              placeholder={'Price'}
              value={newProduct.price}
              onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
            />
            <Input
              placeholder={'Image URL'}
              value={newProduct.image}
              onChange={(e) => setNewProduct({...newProduct, image: e.target.value})}
            />
            <Button
              colorScheme={'blue'} w='full'
              onClick={handleAddProduct}
            >
              Create
            </Button>
          </VStack>
        </Box>
      </VStack>
    </Container>
  )
}

export default CreatePage