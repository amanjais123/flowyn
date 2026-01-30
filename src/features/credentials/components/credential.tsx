"use client" ;
import Image from "next/image";
import { CredentialType } from "@/generated/prisma/enums";
import { useParams, useRouter } from "next/navigation";
import { useCreateCredential, useUpdateCredential , useSuspenseCredential} from "../hooks/use-credentials";
import { useUpgradeModel } from "@/hooks/use-upgrade-model";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { Form ,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,

 } from "@/components/ui/form";
 import { Input } from "@/components/ui/input";
 import { 
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { 
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
 } from "@/components/ui/card";
 import { Button } from "@/components/ui/button";
import Link from "next/link";

const formSchema = z.object({
    name : z.string().min(1, "Name is Required") ,
    type : z.enum(CredentialType) ,
    value: z.string().min(1, "API Key is required") ,
}) ;

type FormValues = z.infer<typeof formSchema> ;

const credentialTypeOptions = [
    {
        value : CredentialType.OPENAI,
        label: "OpenAI" ,
        logo : "/openai.svg" ,
    },
       {
        value : CredentialType.GEMINI,
        label: "Gemini" ,
        logo : "/gemini.svg" ,
    },
       {
        value : CredentialType.ANTHROPIC,
        label: "Anthropic" ,
        logo : "/anthropic.svg" ,
    },
];


interface CredentialFormProps {
    intialData? : {
        id? : string ;
        name : string ;
        type : CredentialType ;
        value : string ;
    } ; 
} ;

export const CredentialForm = ({
    intialData
} : CredentialFormProps) => {

    const router = useRouter() ;
    const CreateCredential = useCreateCredential() ;
    const updateCredential = useUpdateCredential() ;
    const {model , handleError } = useUpgradeModel() ;


    const isEdit = !!intialData?.id ;

    const form = useForm<FormValues>({
       resolver: zodResolver(formSchema) ,
       defaultValues: intialData || {
        name : "",
        type : CredentialType.OPENAI ,
        value : "" ,
       } 
    });


    const onSubmit = async (values : FormValues) => {
        if(isEdit && intialData?.id){
            await updateCredential.mutateAsync({
                id : intialData.id,
                ...values ,
            })
        }else{
            await CreateCredential.mutateAsync(values , {
                onSuccess:(data) => {
                    router.push(`/credentials`);
                } ,
                onError : (error) => {
                    handleError(error) ;
                }
            })
        }
    }
    return (
        <>  
                <div className='p-4 md:px-10 md:py-6'>
<div className='mx-auto max-w-screen-md w-full flex flex-col gap-y-8 h-full'>
        {model}
        <Card className="shadow-none">
            <CardHeader>
                <CardTitle>
                    {isEdit ? "Edit Credentials" : "Add Credentials"}
                </CardTitle>
                <CardDescription>
                    {isEdit 
                    ? "Update your API key or credential details"
                    : "Add a new API key to your account"
                }
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} 
                    className="space-y-6">
                        <FormField 
                        control={form.control}
                        name="name"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>
                                    Name
                                </FormLabel>
                                <FormControl>
                                    <Input
                                    placeholder="My API key" {...field} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}/>


                        <FormField
                         control={form.control}
                         name="type"
                         render={({field}) => (
                            <FormItem>
                                <FormLabel>Label</FormLabel>
                                <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                >
                                    <FormControl>
                                        <SelectTrigger className="w-full">
                                            <SelectValue/>
                                        </SelectTrigger>
                                    </FormControl>

                                    <SelectContent>
                                        {credentialTypeOptions.map((option) => (
                                            <SelectItem
                                            key={option.value}
                                            value={option.value}
                                            >
                                                <div className="flex items-center gap-2">
                                                    <Image
                                                    src={option.logo}
                                                    alt={option.label}
                                                    width={16}
                                                    height={16}
                                                    />
                                                    {option.label}
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>

                                </Select>
                                <FormMessage/>
                            </FormItem>
                        )}
                        />


                          <FormField 
                        control={form.control}
                        name="value"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>
                                    API Key
                                </FormLabel>
                                <FormControl>
                                    <Input
                                     type="password" placeholder="sk-..." {...field} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}/>
                            
                          <div className="flex gap-4">
                            <Button
                             type="submit"
                             disabled={CreateCredential.isPending || updateCredential.isPending}
                             >
                                {isEdit ? "Update" : "Create"}
                            </Button>
                            <Button
                            type="button"
                            variant="outline"
                            asChild
                            >
                               <Link href="/credentials" prefetch>
                               Cancel
                               </Link>

                            </Button>
                          </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
        </div>
        </div>
                </>

    )
};




export const CredentialView = ({
    credentialId,
}: {credentialId : string}) => {
     const {data : credential}  = useSuspenseCredential(credentialId) ;

return <CredentialForm intialData={credential} /> 
}