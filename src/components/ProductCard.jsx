import { EditIcon, DeleteIcon } from '@chakra-ui/icons'
import {
    Box,
    Button,
    Heading,
    HStack,
    IconButton,
    Input,
    Image,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Text,
    useColorModeValue,
    useDisclosure,
    useToast,
    VStack } from '@chakra-ui/react'
import { useProductStore } from '../store/product'
import { useState } from 'react'

const ProductCard = ({ product }) => {
    const textColor = useColorModeValue('gray.600', 'gray.200');
    const bg = useColorModeValue('gray.50', 'gray.800');
    const { updateProduct, deleteProduct } = useProductStore();
    const toast = useToast();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
    const [ updatedProduct, setUpdatedProduct ] = useState(product);

    const handleDeleteProduct = async (pid) => {
        const { success, message } = await deleteProduct(pid);
        if(!success) {
            toast({
                title: 'Error',
                description: message,
                duration: 3000,
                status: 'error',
                isClosable: true
            });
        } else {
            toast({
                title: 'Success',
                description: message,
                duration: 3000,
                status: 'success',
                isClosable: true
            });
        }
    };

    const handleUpdateProduct = async (pid, updatedProduct) => {
        const { success, message } = await updateProduct(pid, updatedProduct);
        onClose();
        if(!success) {
            toast({
                title: 'Error',
                description: message,
                duration: 3000,
                status: 'error',
                isClosable: true
            });
        } else {
            toast({
                title: 'Success',
                description: 'Product updated successfully',
                duration: 3000,
                status: 'success',
                isClosable: true
            });
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUpdatedProduct({ ...updatedProduct, [name]: value });
    };

  return (
    <Box
    transition='all 0.3s'
    _hover={{ transform: 'translate(-5px)'}}
    width="300px"
    height="400px"
    >
        <Image src={product.image} alt={product.name} height="260px" width="100%" objectFit='contain' />

        <Box shadow='lg'
        rounded='lg'
        overflow='hidden'
        bg={bg}
        _hover={{  shadow: 'xl' }}
        >
            <Box p={4}>
                <Heading as='h3' size='sm' mb={2}>
                    {product.name}
                </Heading>
                <Text fontWeight='bold' fontSize='lg' color={textColor} mb={4}>
                    €{product.price}
                </Text>

                <HStack spacing={2}>
                    <IconButton icon={<EditIcon
                    onClick={onOpen} />} colorScheme='blue' />
                    <IconButton icon={<DeleteIcon />} onClick={onDeleteOpen} colorScheme='red' />
                </HStack>
            </Box>
        </Box>
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Update Product</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <VStack spacing={4}>
                        <Input
                        placeholder='Product name'
                        name='name'
                        value={updatedProduct.name || ''}
                        onChange={handleInputChange} />
                        <Input placeholder='Price'
                        name='price'
                        type='number'
                        value={updatedProduct.price || ''}
                        onChange={handleInputChange} />
                        <Input placeholder='Image URL'
                        name='image'
                        value={updatedProduct.image || ''}
                        onChange={handleInputChange} />
                    </VStack>
                </ModalBody>

                <ModalFooter>
                    <Button colorScheme='blue' mr={3} onClick={() => handleUpdateProduct(product._id, updatedProduct)}>
                        Update
                    </Button>
                    <Button variant='ghost' onClick={onClose}>
                        Cancel
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
        <Modal isOpen={isDeleteOpen} onClose={onDeleteClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Confirm Delete</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    Are you sure you want to delete this product?
                </ModalBody>
                <ModalFooter>
                    <Button colorScheme='red' mr={3} onClick={() => handleDeleteProduct(product._id)}>
                        Delete
                    </Button>
                    <Button variant='ghost' onClick={onDeleteClose}>
                        Cancel
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    </Box>
  )
}

export default ProductCard